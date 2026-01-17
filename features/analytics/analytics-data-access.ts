import { randomUUID } from "crypto";
import db from "@/db";
import { gfoSearchLogsTable } from "./analytics-schemas";
import { redis } from "@/lib/redis";
import type {
    ValidatedAnalyticsBatch,
    BufferedAnalyticsEvent
} from "./analytics-validation";

const ANALYTICS_BUFFER_KEY = "analytics:buffer";
const ANALYTICS_DLQ_KEY = "analytics:dlq";

export async function bufferAnalyticsBatch(events: ValidatedAnalyticsBatch): Promise<void> {
    if (events.length === 0) return;

    const serializedEvents = events.map((e) => JSON.stringify(e));
    await redis.rpush(ANALYTICS_BUFFER_KEY, ...serializedEvents);
}

export async function pushToDLQ(rawEvents: string[], errorReason: string): Promise<void> {
    const dlqEntries = rawEvents.map((event) => {
        let originalEvent: unknown;
        try {
            originalEvent = JSON.parse(event);
        } catch {
            originalEvent = event;
        }

        return JSON.stringify({
            failedAt: new Date().toISOString(),
            reason: errorReason,
            originalEvent,
        });
    });

    await redis.rpush(ANALYTICS_DLQ_KEY, ...dlqEntries);
}

export async function processAnalyticsBatch(batchSize: number = 100): Promise<number> {
    const rawEvents = await redis.lpop(ANALYTICS_BUFFER_KEY, batchSize);

    if (!rawEvents) return 0;
    const serializedEvents = Array.isArray(rawEvents) ? rawEvents : [rawEvents];
    if (serializedEvents.length === 0) return 0;

    try {
        const validInserts: typeof gfoSearchLogsTable.$inferInsert[] = [];

        for (const serialized of serializedEvents) {
            const event = JSON.parse(serialized) as BufferedAnalyticsEvent;

            validInserts.push({
                id: randomUUID(),
                recruiterUserId: event.userId,
                eventType: event.eventType,
                metadata: event.metadata,
                createdAt: new Date(event.timestamp),
            });
        }

        if (validInserts.length > 0) {
            await db.insert(gfoSearchLogsTable).values(validInserts);
        }

        return validInserts.length;

    } catch (error: unknown) {
        let errorMessage = "Unknown DB Error";
        if (error instanceof Error) errorMessage = error.message;
        else if (typeof error === "string") errorMessage = error;

        console.error("❌ Analytics Batch Failed. Moving to DLQ.", errorMessage);

        await pushToDLQ(serializedEvents, errorMessage);

        return 0;
    }
}