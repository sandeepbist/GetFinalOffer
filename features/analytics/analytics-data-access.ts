import { randomUUID } from "crypto";
import db from "@/db";
import { gfoSearchLogsTable } from "./analytics-schemas";
import { redis } from "@/lib/redis";
import type {
  ValidatedAnalyticsBatch,
  BufferedAnalyticsEvent,
} from "./analytics-validation";

const ANALYTICS_BUFFER_KEY = "analytics:buffer";
const ANALYTICS_DLQ_KEY = "analytics:dlq";

export async function bufferAnalyticsBatch(
  events: ValidatedAnalyticsBatch
): Promise<void> {
  if (events.length === 0) return;

  const serializedEvents = events.map((e) => JSON.stringify(e));
  await redis.rpush(ANALYTICS_BUFFER_KEY, ...serializedEvents);
}

export async function pushToDLQ(
  rawEvents: string[],
  errorReason: string
): Promise<void> {
  if (rawEvents.length === 0) return;

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

export async function processAnalyticsBatch(
  batchSize: number = 100
): Promise<number> {
  const rawEvents = await redis.lpop(ANALYTICS_BUFFER_KEY, batchSize);

  if (!rawEvents) return 0;
  const serializedEvents = Array.isArray(rawEvents) ? rawEvents : [rawEvents];
  if (serializedEvents.length === 0) return 0;

  const validBatchItems: { raw: string; data: typeof gfoSearchLogsTable.$inferInsert }[] = [];
  const corruptEvents: string[] = [];

  for (const serialized of serializedEvents) {
    try {
      const event = JSON.parse(serialized) as BufferedAnalyticsEvent;
      validBatchItems.push({
        raw: serialized,
        data: {
          id: randomUUID(),
          recruiterUserId: event.userId,
          eventType: event.eventType,
          metadata: event.metadata,
          createdAt: new Date(event.timestamp),
        },
      });
    } catch (e) {
      corruptEvents.push(serialized);
    }
  }

  if (corruptEvents.length > 0) {
    console.warn(`⚠️ Found ${corruptEvents.length} corrupt JSON events. Sending to DLQ.`);
    await pushToDLQ(corruptEvents, "JSON Parse Error");
  }

  if (validBatchItems.length === 0) return 0;

  const insertValues = validBatchItems.map((i) => i.data);

  try {
    await db.insert(gfoSearchLogsTable).values(insertValues);
    return insertValues.length;
  } catch (error: any) {
    console.error(`❌ DB Batch Failed (Size: ${insertValues.length}). Sending entire batch to DLQ.`);
    console.error(`Reason: ${error.message}`);

    const failedRawEvents = validBatchItems.map((i) => i.raw);
    await pushToDLQ(failedRawEvents, `DB Insert Failed: ${error.message}`);

    return 0;
  }
}
