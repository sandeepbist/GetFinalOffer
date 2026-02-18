const DEFAULT_WORKER_DRAIN_DELAY_SECONDS = 300;
const MIN_WORKER_DRAIN_DELAY_SECONDS = 1;
const MAX_WORKER_DRAIN_DELAY_SECONDS = 600;

export function getWorkerDrainDelaySeconds(): number {
  const raw = process.env.WORKER_DRAIN_DELAY_SECONDS;
  if (!raw) return DEFAULT_WORKER_DRAIN_DELAY_SECONDS;

  const trimmed = raw.trim();
  if (!/^-?\d+$/.test(trimmed)) return DEFAULT_WORKER_DRAIN_DELAY_SECONDS;

  const parsed = Number(trimmed);
  if (!Number.isSafeInteger(parsed)) return DEFAULT_WORKER_DRAIN_DELAY_SECONDS;
  if (
    parsed < MIN_WORKER_DRAIN_DELAY_SECONDS ||
    parsed > MAX_WORKER_DRAIN_DELAY_SECONDS
  ) {
    return DEFAULT_WORKER_DRAIN_DELAY_SECONDS;
  }

  return parsed;
}
