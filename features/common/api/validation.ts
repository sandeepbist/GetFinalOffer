import { z } from "zod";

export const paginationSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(10),
});

export const candidateSearchSchema = paginationSchema.extend({
    search: z.string().max(500).default(""),
    minYears: z.coerce.number().int().min(0).max(50).default(0),
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

export type PaginationParams = z.infer<typeof paginationSchema>;
export type CandidateSearchParams = z.infer<typeof candidateSearchSchema>;

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
