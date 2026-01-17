import { z } from "zod";

const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:?\d{2})$/;
const timestampSchema = z.string().regex(isoDateRegex, "Invalid ISO Date Format");

export const SearchMetadataSchema = z.object({
    query: z.string(),
    resultsCount: z.number(),
    executionTimeMs: z.number(),
    filters: z.object({
        minYears: z.number().optional(),
        location: z.string().optional(),
    }).optional(),
});
export type SearchEventMetadata = z.infer<typeof SearchMetadataSchema>;

export const ClickMetadataSchema = z.object({
    candidateId: z.string(),
    rankPosition: z.number(),
});
export type ClickEventMetadata = z.infer<typeof ClickMetadataSchema>;

export const ProfileViewMetadataSchema = z.object({
    candidateId: z.string(),
    durationMs: z.number().optional(),
});
export type ProfileViewEventMetadata = z.infer<typeof ProfileViewMetadataSchema>;

export const AnalyticsEventSchema = z.discriminatedUnion("eventType", [
    z.object({
        eventType: z.literal("SEARCH"),
        userId: z.string(),
        timestamp: timestampSchema,
        metadata: SearchMetadataSchema,
    }),
    z.object({
        eventType: z.literal("CLICK"),
        userId: z.string(),
        timestamp: timestampSchema,
        metadata: ClickMetadataSchema,
    }),
    z.object({
        eventType: z.literal("PROFILE_VIEW"),
        userId: z.string(),
        timestamp: timestampSchema,
        metadata: ProfileViewMetadataSchema,
    }),
]);

export type AnalyticsEventDTO = z.infer<typeof AnalyticsEventSchema>;
export type BufferedAnalyticsEvent = AnalyticsEventDTO;

export const AnalyticsBatchSchema = z.array(AnalyticsEventSchema);
export type ValidatedAnalyticsBatch = z.infer<typeof AnalyticsBatchSchema>;