import { z } from "zod";

export const paginationSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(10),
});

export const candidateSearchSchema = paginationSchema.extend({
    search: z.string().max(500).default(""),
    minYears: z.coerce.number().int().min(0).max(50).default(0),
    companyId: z.string().trim().min(1).max(128).optional(),
});

export const verificationActionSchema = z.enum(["profile", "interview"]);

export const interviewVerificationSchema = z.object({
    action: z.literal("interview"),
    interviewProgressId: z.string().uuid("Invalid interview progress ID"),
    subject: z.string().max(200).optional().default(""),
    notes: z.string().max(2000).optional().default(""),
});

export const profileVerificationSchema = z.object({
    action: z.literal("profile"),
});

const isoDateString = z.string().refine(
    (value) => !Number.isNaN(Date.parse(value)),
    "Invalid date string"
);

export const interviewProgressEntrySchema = z.object({
    id: z.string().min(1).max(128),
    companyId: z.string().min(1).max(128),
    position: z.string().min(1).max(200),
    roundsCleared: z.number().int().min(0).max(50),
    totalRounds: z.number().int().min(0).max(50),
    status: z.string().min(1).max(50),
    dateCleared: isoDateString,
    verificationStatus: z.string().optional(),
});

export const candidateProfileSchema = z.object({
    professionalTitle: z.string().trim().min(1, "Professional title is required").max(200),
    currentRole: z.string().trim().max(200).optional().default(""),
    yearsExperience: z.number().int().min(0).max(60),
    location: z.string().trim().min(1, "Location is required").max(200),
    bio: z.string().max(5000).optional().default(""),
    skillIds: z.array(z.string().min(1).max(128)).max(100).optional().default([]),
    interviewProgress: z
        .array(interviewProgressEntrySchema)
        .max(100)
        .optional()
        .default([]),
});

export const candidateProfileUpdateSchema = candidateProfileSchema.extend({
    resumeUrl: z.string().url().optional(),
});

export type PaginationParams = z.infer<typeof paginationSchema>;
export type CandidateSearchParams = z.infer<typeof candidateSearchSchema>;
export type CandidateProfileInput = z.infer<typeof candidateProfileSchema>;
export type CandidateProfileUpdateInput = z.infer<typeof candidateProfileUpdateSchema>;
export type InterviewProgressEntryInput = z.infer<typeof interviewProgressEntrySchema>;

export function zodFieldErrors(error: z.ZodError): Array<{ field: string; message: string }> {
    return error.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
    }));
}

export function parseSearchParams<T extends z.ZodType>(
    searchParams: URLSearchParams,
    schema: T
): z.infer<T> | { error: z.ZodError } {
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
        params[key] = value;
    });

    const result = schema.safeParse(params);
    if (!result.success) {
        return { error: result.error };
    }
    return result.data;
}
