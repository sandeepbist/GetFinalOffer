import db from "@/db";
import { gfoGraphMetricsMinuteTable } from "@/db/schemas";
import {
  clearMetricBucket,
  listMetricBuckets,
  readBucketMetrics,
} from "@/lib/graph/metrics";

function toBucketDate(bucket: string): Date {
  const minute = Number(bucket);
  if (!Number.isFinite(minute)) return new Date();
  return new Date(minute * 60 * 1000);
}

export async function flushGraphMetricsProcessor(): Promise<{
  flushedBuckets: number;
  rowsInserted: number;
}> {
  const nowBucket = Math.floor(Date.now() / 60000);
  const buckets = await listMetricBuckets();
  const flushable = buckets.filter((bucket) => Number(bucket) < nowBucket);

  let rowsInserted = 0;

  for (const bucket of flushable) {
    const metrics = await readBucketMetrics(bucket);
    const entries = Object.entries(metrics);
    if (entries.length === 0) {
      await clearMetricBucket(bucket);
      continue;
    }

    const rows = entries
      .map(([metricName, metricValue]) => ({
        bucketStart: toBucketDate(bucket),
        metricName,
        metricValue: Number(metricValue) || 0,
        dimensions: null,
      }))
      .filter((row) => Number.isFinite(row.metricValue));

    if (rows.length > 0) {
      await db.insert(gfoGraphMetricsMinuteTable).values(rows);
      rowsInserted += rows.length;
    }

    await clearMetricBucket(bucket);
  }

  return {
    flushedBuckets: flushable.length,
    rowsInserted,
  };
}
