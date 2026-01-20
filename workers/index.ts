import "dotenv/config";

import {
    vectorizerQueue,
    broadcasterQueue,
} from "@/lib/queue";

import { extractorWorker } from "./ingestion/extractor";
import { vectorizerWorker } from "./ingestion/vectorizer";
import { broadcasterWorker } from "./ingestion/Broadcaster";
import { profileSyncProcessor } from "./profile-sync-worker";
const SYNC_INTERVAL_MS = 10 * 60 * 1000;

console.log("🚀 Starting Agentic Pipeline...");


extractorWorker.on("completed", async (job, result) => {
    if (result) {
        console.log(`[Flow] Extractor finished ${job.id}. Queueing Vectorizer...`);
        await vectorizerQueue.add("vectorize", result);
    }
});

vectorizerWorker.on("completed", async (job, result) => {
    if (result) {
        console.log(`[Flow] Vectorizer finished ${job.id}. Queueing Broadcaster...`);
        await broadcasterQueue.add("broadcast", result);
    }
});

extractorWorker.on("failed", (job, err) => console.error(`[Extractor] Failed ${job?.id}`, err));
vectorizerWorker.on("failed", (job, err) => console.error(`[Vectorizer] Failed ${job?.id}`, err));
broadcasterWorker.on("failed", (job, err) => console.error(`[Broadcaster] Failed ${job?.id}`, err));


async function runBatchSync() {
    try {
        const result = await profileSyncProcessor();

        if (result && result.processed > 0) {
            console.log(`[Interval] Sync run complete. Processed: ${result.processed}`);
        }
    } catch (err) {
        console.error("[Interval] Sync run failed:", err);
    }
}

runBatchSync();
setInterval(runBatchSync, SYNC_INTERVAL_MS);

console.log("✅ All Systems Operational: Pipeline + Sync Interval");