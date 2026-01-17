import { Queue, Worker } from "bullmq";
import { redis } from "./redis";

export const RESUME_QUEUE_NAME = "resume-processing";

export const resumeQueue = new Queue(RESUME_QUEUE_NAME, {
  connection: redis as any,
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

export const createResumeWorker = (processor: any) => {
  return new Worker(RESUME_QUEUE_NAME, processor, {
    connection: redis as any,
    concurrency: 1,
  });
};
