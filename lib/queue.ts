import { Queue, Worker, type Processor, type ConnectionOptions } from "bullmq";
import { redis } from "./redis";

export const RESUME_QUEUE_NAME = "resume-processing";

export const resumeQueue = new Queue(RESUME_QUEUE_NAME, {
  connection: redis as unknown as ConnectionOptions,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
    removeOnComplete: true,
    removeOnFail: { count: 50 },
  },
});

export const createResumeWorker = (processor: Processor) => {
  return new Worker(RESUME_QUEUE_NAME, processor, {
    connection: redis as unknown as ConnectionOptions,
    concurrency: 1,
  });
};
