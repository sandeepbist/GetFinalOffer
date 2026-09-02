import { Queue, Worker, FlowProducer, type Processor, type ConnectionOptions } from "bullmq";
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

const flowProducer = new FlowProducer({ connection });

/**
 * Enqueue the whole resume-ingestion chain as one atomic BullMQ flow:
 * extractor runs first, its completion unblocks the vectorizer, whose
 * completion unblocks the broadcaster. Unlike in-process completed-handler
 * chaining, a worker crash can never silently lose the rest of the chain —
 * the dependency graph lives in Redis.
 *
 * Parents wait on children and read their outputs via getChildrenValues()
 * inside each processor.
 */
export async function enqueueResumeIngestionFlow(payload: {
  userId: string;
  resumeUrl: string;
  bio: string;
}): Promise<void> {
  await flowProducer.add({
    name: "broadcast",
    queueName: INGESTION_QUEUE_C,
    children: [
      {
        name: "vectorize",
        queueName: INGESTION_QUEUE_B,
        children: [
          {
            name: "process-resume",
            queueName: INGESTION_QUEUE_A,
            data: payload,
          },
        ],
      },
    ],
  });
}

export const createWorker = (name: string, processor: Processor, concurrency = 1) => {
  return new Worker(name, processor, {
    connection,
    concurrency,
    lockDuration: 5 * 60 * 1000,
    // BullMQ expects drainDelay in milliseconds; the config is expressed in seconds.
    drainDelay: getWorkerDrainDelaySeconds() * 1000,
    // Stalled checks on: a worker that dies mid-job releases its lock and
    // the job retries per its attempts. Healthy long jobs are unaffected —
    // the lock auto-renews at half the lockDuration while the process runs.
    maxStalledCount: 2,
    stalledInterval: 30 * 1000,
  });
};
