import "dotenv/config";

import {
    createWorker,
    PROFILE_SYNC_QUEUE_NAME,
    vectorizerQueue,
    broadcasterQueue,
    profileSyncQueue
} from "@/lib/queue";

import { extractorWorker } from "./ingestion/extractor";
import { vectorizerWorker } from "./ingestion/vectorizer";
import { broadcasterWorker } from "./ingestion/Broadcaster";
import { profileSyncProcessor } from "./profile-sync-worker";

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

const batchSyncWorker = createWorker(
    PROFILE_SYNC_QUEUE_NAME,
    profileSyncProcessor,
    1
);

batchSyncWorker.on("failed", (job, err) => {
    console.error(`[BatchSync] Failed job ${job?.id}`, err);
});
batchSyncWorker.on("completed", (job) => {

});

async function scheduleSyncHeartbeat() {
    const jobs = await profileSyncQueue.getRepeatableJobs();
    for (const job of jobs) {
        await profileSyncQueue.removeRepeatableByKey(job.key);
    }

    await profileSyncQueue.add(
        "batch-drain-pulse",
        {},
        {
            repeat: { every: 10 * 60 * 1000 },
            removeOnComplete: true
        }
    );
    console.log("💓 Sync Heartbeat Scheduled");
}

scheduleSyncHeartbeat().catch(console.error);

console.log("✅ All Systems Operational: Ingestion + Sync");
