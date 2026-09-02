import "dotenv/config";

import { extractorWorker } from "./ingestion/extractor";
import { vectorizerWorker } from "./ingestion/vectorizer";
import { broadcasterWorker } from "./ingestion/Broadcaster";
import { profileSyncProcessor } from "./profile-sync-worker";
import { graphSyncWorker } from "./graph-sync-worker";
import { flushGraphMetricsProcessor } from "./graph-metrics-flush-worker";
import { graphAlertProcessor } from "./graph-alert-worker";
import { rankGraphProposalsProcessor } from "./graph-proposal-ranker";
import { runAnalyticsWorker, stopAnalyticsWorker } from "./analytics-worker";
import { runRetentionProcessor } from "./retention-worker";
import { getWorkerDrainDelaySeconds } from "@/lib/worker-config";

const SYNC_INTERVAL_MS = 10 * 60 * 1000;
const GRAPH_METRIC_FLUSH_INTERVAL_MS = 60 * 1000;
const GRAPH_ALERT_INTERVAL_MS = 5 * 60 * 1000;
const GRAPH_PROPOSAL_RANK_INTERVAL_MS = 60 * 60 * 1000;
const RETENTION_INTERVAL_MS = 24 * 60 * 60 * 1000;
const SHUTDOWN_TIMEOUT_MS = 30 * 1000;

console.log(`[WorkerConfig] drainDelaySeconds=${getWorkerDrainDelaySeconds()}`);
console.log("[Workers] Starting ingestion, graph, and analytics pipelines...");

// Ingestion chain ordering lives in BullMQ Flows (see enqueueResumeIngestionFlow
// in lib/queue): extractor -> vectorizer -> broadcaster dependencies are stored
// in Redis, so a process crash can never silently drop the rest of the chain.
extractorWorker.on("failed", (job, err) => console.error(`[Extractor] Failed ${job?.id}`, err));
vectorizerWorker.on("failed", (job, err) => console.error(`[Vectorizer] Failed ${job?.id}`, err));
broadcasterWorker.on("failed", (job, err) => console.error(`[Broadcaster] Failed ${job?.id}`, err));
graphSyncWorker.on("failed", (job, err) => console.error(`[GraphSync] Failed ${job?.id}`, err));
graphSyncWorker.on("completed", (job, result) => {
  if (result) {
    console.log(`[GraphSync] Synced candidate graph for ${result.userId}`);
  }
});

runAnalyticsWorker().catch((err: unknown) => {
  console.error("[Analytics] Worker critical failure:", err);
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

async function runRetention() {
  try {
    await runRetentionProcessor();
  } catch (err) {
    console.error("[Retention] Run failed:", err);
  }
}

runBatchSync();
runGraphMetricFlush();
runGraphAlerts();
runGraphProposalRanking();
runRetention();

const timers: NodeJS.Timeout[] = [
  setInterval(runBatchSync, SYNC_INTERVAL_MS),
  setInterval(runGraphMetricFlush, GRAPH_METRIC_FLUSH_INTERVAL_MS),
  setInterval(runGraphAlerts, GRAPH_ALERT_INTERVAL_MS),
  setInterval(runGraphProposalRanking, GRAPH_PROPOSAL_RANK_INTERVAL_MS),
  // Daily is plenty for a retention job; it also runs once at boot.
  setInterval(runRetention, RETENTION_INTERVAL_MS),
];

console.log("[Workers] All systems operational: pipeline + sync intervals");

let shuttingDown = false;

async function shutdown(signal: string) {
  if (shuttingDown) return;
  shuttingDown = true;

  console.log(`[Workers] ${signal} received, draining...`);
  for (const timer of timers) clearInterval(timer);

  await stopAnalyticsWorker();

  // Closing a BullMQ worker waits for the active job to finish; the hard
  // timeout below bounds the wait so a stuck job cannot block the exit.
  const workers = [extractorWorker, vectorizerWorker, broadcasterWorker, graphSyncWorker];
  const closed = Promise.allSettled(
    workers.map((worker) => worker.close())
  );

  const timeout = new Promise((resolve) => setTimeout(resolve, SHUTDOWN_TIMEOUT_MS));
  await Promise.race([closed, timeout]);

  console.log("[Workers] Shutdown complete");
  process.exit(0);
}

process.on("SIGTERM", () => void shutdown("SIGTERM"));
process.on("SIGINT", () => void shutdown("SIGINT"));
