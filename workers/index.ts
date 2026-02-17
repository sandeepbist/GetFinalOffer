import "dotenv/config";

import {
    vectorizerQueue,
    broadcasterQueue,
} from "@/lib/queue";

import { extractorWorker } from "./ingestion/extractor";
import { vectorizerWorker } from "./ingestion/vectorizer";
import { broadcasterWorker } from "./ingestion/Broadcaster";
import { profileSyncProcessor } from "./profile-sync-worker";
import { graphSyncWorker } from "./graph-sync-worker";
import { flushGraphMetricsProcessor } from "./graph-metrics-flush-worker";
import { graphAlertProcessor } from "./graph-alert-worker";
import { rankGraphProposalsProcessor } from "./graph-proposal-ranker";
const SYNC_INTERVAL_MS = 10 * 60 * 1000;
const GRAPH_METRIC_FLUSH_INTERVAL_MS = 60 * 1000;
const GRAPH_ALERT_INTERVAL_MS = 5 * 60 * 1000;
const GRAPH_PROPOSAL_RANK_INTERVAL_MS = 60 * 60 * 1000;

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
graphSyncWorker.on("failed", (job, err) => console.error(`[GraphSync] Failed ${job?.id}`, err));
graphSyncWorker.on("completed", (job, result) => {
    if (result) {
        console.log(`[GraphSync] ✅ Synced candidate graph for ${result.userId}`);
    }
});


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

async function runGraphMetricFlush() {
    try {
        const result = await flushGraphMetricsProcessor();
        if (result.rowsInserted > 0) {
            console.log(`[GraphMetrics] Flushed ${result.rowsInserted} rows across ${result.flushedBuckets} buckets`);
        }
    } catch (err) {
        console.error("[GraphMetrics] Flush run failed:", err);
    }
}

async function runGraphAlerts() {
    try {
        await graphAlertProcessor();
    } catch (err) {
        console.error("[GraphAlerts] Alert run failed:", err);
    }
}

runGraphMetricFlush();
runGraphAlerts();
setInterval(runGraphMetricFlush, GRAPH_METRIC_FLUSH_INTERVAL_MS);
setInterval(runGraphAlerts, GRAPH_ALERT_INTERVAL_MS);

async function runGraphProposalRanking() {
    try {
        const result = await rankGraphProposalsProcessor();
        if (result.processed > 0) {
            console.log(`[GraphProposals] Ranked ${result.processed} pending proposals`);
        }
    } catch (err) {
        console.error("[GraphProposals] Ranker run failed:", err);
    }
}

runGraphProposalRanking();
setInterval(runGraphProposalRanking, GRAPH_PROPOSAL_RANK_INTERVAL_MS);

console.log("✅ All Systems Operational: Pipeline + Sync Interval");


// Apply when in High level Prod
// import "dotenv/config";

// import {
//     createWorker,
//     PROFILE_SYNC_QUEUE_NAME,
//     vectorizerQueue,
//     broadcasterQueue,
//     profileSyncQueue
// } from "@/lib/queue";

// import { extractorWorker } from "./ingestion/extractor";
// import { vectorizerWorker } from "./ingestion/vectorizer";
// import { broadcasterWorker } from "./ingestion/Broadcaster";
// import { profileSyncProcessor } from "./profile-sync-worker";

// console.log("🚀 Starting Agentic Pipeline...");

// extractorWorker.on("completed", async (job, result) => {
//     if (result) {
//         console.log(`[Flow] Extractor finished ${job.id}. Queueing Vectorizer...`);
//         await vectorizerQueue.add("vectorize", result);
//     }
// });

// vectorizerWorker.on("completed", async (job, result) => {
//     if (result) {
//         console.log(`[Flow] Vectorizer finished ${job.id}. Queueing Broadcaster...`);
//         await broadcasterQueue.add("broadcast", result);
//     }
// });

// extractorWorker.on("failed", (job, err) => console.error(`[Extractor] Failed ${job?.id}`, err));
// vectorizerWorker.on("failed", (job, err) => console.error(`[Vectorizer] Failed ${job?.id}`, err));
// broadcasterWorker.on("failed", (job, err) => console.error(`[Broadcaster] Failed ${job?.id}`, err));

// const batchSyncWorker = createWorker(
//     PROFILE_SYNC_QUEUE_NAME,
//     profileSyncProcessor,
//     1
// );

// batchSyncWorker.on("failed", (job, err) => {
//     console.error(`[BatchSync] Failed job ${job?.id}`, err);
// });
// batchSyncWorker.on("completed", (job) => {

// });

// async function scheduleSyncHeartbeat() {
//     const jobs = await profileSyncQueue.getRepeatableJobs();
//     for (const job of jobs) {
//         await profileSyncQueue.removeRepeatableByKey(job.key);
//     }

//     await profileSyncQueue.add(
//         "batch-drain-pulse",
//         {},
//         {
//             repeat: { every: 10 * 60 * 1000 },
//             removeOnComplete: true
//         }
//     );
//     console.log("💓 Sync Heartbeat Scheduled");
// }

// scheduleSyncHeartbeat().catch(console.error);

// console.log("✅ All Systems Operational: Ingestion + Sync");
