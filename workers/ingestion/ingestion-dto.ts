import { z } from "zod";

export const EvidenceTypeEnum = z.enum([
    "resume_section",
    "project_description",
    "github_code",
    "interview_verified",
]);


export const IngestionJobPayloadSchema = z.object({
    userId: z.string().cuid2(),
    resumeUrl: z.string().url(),
    bio: z.string().optional(),
});
export type IngestionJobPayload = z.infer<typeof IngestionJobPayloadSchema>;

export const ExtractedSkillSchema = z.object({
    name: z.string(),
    confidence: z.number().min(0).max(1),
    evidence: z.string(),
    evidenceType: EvidenceTypeEnum,
});
export type ExtractedSkill = z.infer<typeof ExtractedSkillSchema>;

export const ExtractorOutputSchema = z.object({
    userId: z.string(),
    fullText: z.string(),
    extractedSkills: z.array(ExtractedSkillSchema),
    rawChunks: z.array(z.string()),
});
export type ExtractorOutput = z.infer<typeof ExtractorOutputSchema>;

export const VectorizerOutputSchema = z.object({
    userId: z.string(),
    vectors: z.array(z.array(z.number())),
    chunkIds: z.array(z.string()),
    rawChunks: z.array(z.string()),
    extractedSkills: z.array(ExtractedSkillSchema),
});
export type VectorizerOutput = z.infer<typeof VectorizerOutputSchema>;
