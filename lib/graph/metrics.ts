import { redis } from "@/lib/redis";
import type { GraphMetricEnvelope } from "@/lib/graph/types";

const GRAPH_METRIC_BUCKET_SET_KEY = "graph:metrics:buckets";
const GRAPH_METRIC_PREFIX = "graph:metrics:minute";

export const GRAPH_METRIC_NAMES = {
  attempted: "graph_attempted_count",
  fallback: "graph_fallback_count",
  zeroExpansion: "graph_zero_expansion_count",
  expandedSkills: "graph_expanded_skill_count",
  latencyMsSum: "graph_latency_ms_sum",
  newCandidates: "graph_new_candidates_found",
  liveSearches: "graph_live_search_count",
  graphEnabled: "graph_enabled_count",
} as const;

function getMinuteBucket(ts = Date.now()): string {
  return String(Math.floor(ts / 60000));
}

function bucketKey(bucket: string): string {
  return `${GRAPH_METRIC_PREFIX}:${bucket}`;
}

async function trackMetric(
  bucket: string,
  field: string,
  amount: number
): Promise<void> {
  const key = bucketKey(bucket);
  const pipeline = redis.pipeline();
  pipeline.hincrbyfloat(key, field, amount);
  pipeline.expire(key, 60 * 60 * 24 * 14);
  pipeline.sadd(GRAPH_METRIC_BUCKET_SET_KEY, bucket);
  await pipeline.exec();
}

export async function recordGraphOperationalMetric(
  metricName: string,
  amount = 1
): Promise<void> {
  const bucket = getMinuteBucket();
  await trackMetric(bucket, metricName, amount);
}

export async function recordGraphSearchMetrics(
  input: GraphMetricEnvelope
): Promise<void> {
  const bucket = getMinuteBucket();

  await trackMetric(bucket, GRAPH_METRIC_NAMES.liveSearches, 1);

  if (!input.graphEnabled) return;

  await trackMetric(bucket, GRAPH_METRIC_NAMES.graphEnabled, 1);
  await trackMetric(bucket, GRAPH_METRIC_NAMES.attempted, 1);
  await trackMetric(
    bucket,
    GRAPH_METRIC_NAMES.expandedSkills,
    Math.max(0, input.expandedSkillCount)
  );
  await trackMetric(
    bucket,
    GRAPH_METRIC_NAMES.latencyMsSum,
    Math.max(0, input.graphLatencyMs)
  );
  await trackMetric(
    bucket,
    GRAPH_METRIC_NAMES.newCandidates,
    Math.max(0, input.graphNewCandidatesFound)
  );

  if (input.graphFallbackUsed) {
    await trackMetric(bucket, GRAPH_METRIC_NAMES.fallback, 1);
  }

  if (input.expandedSkillCount === 0) {
    await trackMetric(bucket, GRAPH_METRIC_NAMES.zeroExpansion, 1);
  }
}

export async function listMetricBuckets(): Promise<string[]> {
  return await redis.smembers(GRAPH_METRIC_BUCKET_SET_KEY);
}

export async function readBucketMetrics(
  bucket: string
): Promise<Record<string, string>> {
  return await redis.hgetall(bucketKey(bucket));
}

export async function clearMetricBucket(bucket: string): Promise<void> {
  const key = bucketKey(bucket);
  const pipeline = redis.pipeline();
  pipeline.del(key);
  pipeline.srem(GRAPH_METRIC_BUCKET_SET_KEY, bucket);
  await pipeline.exec();
}

export function parseMetricValue(metrics: Record<string, string>, field: string): number {
  const raw = metrics[field];
  if (!raw) return 0;
  const n = Number(raw);
  return Number.isFinite(n) ? n : 0;
}
