import { Worker, Job, type ConnectionOptions } from "bullmq";
import OpenAI from "openai";
import db from "@/db";
import { gfoSkillsLibraryTable } from "@/db/schemas";
import { sql } from "drizzle-orm";
import { extractTextFromPDF } from "@/lib/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { redis } from "@/lib/redis";
import {
    IngestionJobPayload,
    ExtractorOutput,
    ExtractedSkill,
    EvidenceTypeEnum
} from "./ingestion-dto";
import { z } from "zod";

const openai = new OpenAI();

function minifyTextForLLM(text: string): string {
    return text
        .replace(/\s+/g, " ")
        .replace(/[^\w\s.,;@/()-]/g, "")
        .trim()
        .slice(0, 12000);
}

async function normalizeSkill(rawName: string): Promise<string> {
    const normalized = rawName.trim();
    const [exact] = await db
        .select({ name: gfoSkillsLibraryTable.name })
        .from(gfoSkillsLibraryTable)
        .where(sql`LOWER(${gfoSkillsLibraryTable.name}) = LOWER(${normalized})`)
        .limit(1);
    return exact ? exact.name : normalized;
}

async function extractSkillsWithLLM(text: string): Promise<ExtractedSkill[]> {
    const cleanText = minifyTextForLLM(text);

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: `You are a Technical Auditor. Extract top 15 technical skills based on "Depth of Usage".

        Scoring Rules (Semantic Depth):
        - 0.9-1.0 (Expert): Context shows complex problem solving ("Optimized", "Architected", "Debugged core issue", "Custom implementation").
        - 0.6-0.8 (Practitioner): Context shows active creation ("Built X using Y", "Implemented feature").
        - 0.3-0.5 (Passive): Context is weak ("Used", "Familiar with") or just listed in a keyword section.

        Constraints:
        - IGNORE soft skills.
        - IGNORE minor tools (Jira, Trello) unless central to a DevOps role.
        - Return strictly JSON.`
            },
            { role: "user", content: `Resume Text:\n${cleanText}` }
        ],
        response_format: { type: "json_object" },
        temperature: 0,
        max_tokens: 800,
    });

    const raw = JSON.parse(completion.choices[0].message.content || "{}");
    if (!raw.skills || !Array.isArray(raw.skills)) return [];

    const validSkills: ExtractedSkill[] = [];

    for (const s of raw.skills) {
        if (typeof s.name === "string" && typeof s.confidence === "number") {

            let type: z.infer<typeof EvidenceTypeEnum> = "resume_section";

            if (s.confidence >= 0.85) {
                type = "project_description";
            } else if (s.confidence >= 0.95) {
                type = "interview_verified";
            }

            validSkills.push({
                name: s.name,
                confidence: s.confidence,
                evidence: s.evidence || "Contextual usage",
                evidenceType: type,
            });
        }
    }

    return validSkills;
}

export const extractorWorker = new Worker<IngestionJobPayload, ExtractorOutput>(
    "ingestion-extractor",
    async (job: Job<IngestionJobPayload>) => {
        const { userId, resumeUrl, bio } = job.data;

        const response = await fetch(resumeUrl);
        if (!response.ok) throw new Error(`Failed to fetch PDF`);
        const buffer = Buffer.from(await response.arrayBuffer());

        let fullText = await extractTextFromPDF(buffer);
        fullText = `Bio: ${bio || ""}\n\n${fullText}`;

        const [docs, rawSkills] = await Promise.all([
            new RecursiveCharacterTextSplitter({
                chunkSize: 500, chunkOverlap: 50
            }).createDocuments([fullText]),

            extractSkillsWithLLM(fullText)
        ]);

        const normalizedSkills: ExtractedSkill[] = [];
        for (const skill of rawSkills) {
            const canonicalName = await normalizeSkill(skill.name);
            normalizedSkills.push({ ...skill, name: canonicalName });
        }

        return {
            userId,
            fullText,
            extractedSkills: normalizedSkills,
            rawChunks: docs.map(d => d.pageContent),
        };
    },
    {
        connection: redis as unknown as ConnectionOptions,
        concurrency: 1, drainDelay: 60000,
        skipStalledCheck: true
    }
);
