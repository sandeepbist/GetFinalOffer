import { Queue, Worker, type Processor, type ConnectionOptions } from "bullmq";
import { redis } from "./redis";
import { getWorkerDrainDelaySeconds } from "./worker-config";

const connection = redis as unknown as ConnectionOptions;

const DEFAULT_OPTS = {
  attempts: 3,
  backoff: { type: "exponential", delay: 1000 },
  removeOnComplete: true,
  removeOnFail: { count: 50 },
};

export const INGESTION_QUEUE_A = "ingestion-extractor";
export const resumeQueue = new Queue(INGESTION_QUEUE_A, {
  connection,
  defaultJobOptions: DEFAULT_OPTS,
});

export const INGESTION_QUEUE_B = "ingestion-vectorizer";
export const vectorizerQueue = new Queue(INGESTION_QUEUE_B, {
  connection,
  defaultJobOptions: DEFAULT_OPTS,
});

export const INGESTION_QUEUE_C = "ingestion-broadcaster";
export const broadcasterQueue = new Queue(INGESTION_QUEUE_C, {
  connection,
  defaultJobOptions: DEFAULT_OPTS,
});

export const GRAPH_SYNC_QUEUE_NAME = "graph-sync";
export const graphSyncQueue = new Queue(GRAPH_SYNC_QUEUE_NAME, {
  connection,
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: { count: 50 },
    attempts: 3,
    backoff: { type: "exponential", delay: 1000 },
  },
});

export const createWorker = (name: string, processor: Processor, concurrency = 1) => {
  return new Worker(name, processor, {
    connection,
    concurrency,
    lockDuration: 5 * 60 * 1000,
    // BullMQ expects drainDelay in milliseconds; the config is expressed in seconds.
    drainDelay: getWorkerDrainDelaySeconds() * 1000,
    skipStalledCheck: true,
    maxStalledCount: 0,
  });
};
