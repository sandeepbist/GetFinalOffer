import OpenAI from "openai";
import type { CandidateSummaryDTO } from "@/features/recruiter/candidates-dto";
import { createCircuitBreaker } from "@/lib/resilience";

const openai = new OpenAI();

async function evaluateCandidatesRaw(
    query: string,
    candidates: CandidateSummaryDTO[]
): Promise<CandidateSummaryDTO[]> {
    if (candidates.length === 0) return [];

    const topCandidates = candidates.slice(0, 5);

    const candidatesContext = topCandidates.map((c) =>
        `ID: ${c.id} | Title: ${c.title} | Bio Snippet: ${c.matchHighlight || c.bio?.substring(0, 100)}`
    ).join("\n");

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: `You are a Ranking Expert.
          1. Assign a relevance score (0-100) based on the Query: "${query}".
          2. Write a brutally honest 1-sentence reason.

          Format JSON: { "evaluations": { "candidate_id": { "score": 95, "reason": "Reasoning here." } } }`
            },
            { role: "user", content: candidatesContext }
        ],
        response_format: { type: "json_object" },
        temperature: 0
    });

    const evaluations = JSON.parse(completion.choices[0].message.content || "{}").evaluations || {};

    return candidates.map(c => {
        const evalData = evaluations[c.id];
        if (evalData) {
            return {
                ...c,
                matchScore: evalData.score,
                aiReasoning: evalData.reason
            };
        }
        return c;
    }).sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
}

const breaker = createCircuitBreaker(evaluateCandidatesRaw, "evaluator-agent");

export class EvaluatorAgent {
    static async evaluateCandidates(
        query: string,
        candidates: CandidateSummaryDTO[]
    ): Promise<CandidateSummaryDTO[]> {
        try {
            return await breaker.fire(query, candidates);
        } catch (err) {
            console.warn("⚠️ Evaluator Agent Failed. Returning raw candidates.", err);
            return candidates;
        }
    }
}
