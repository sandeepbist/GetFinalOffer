import { sql } from "drizzle-orm";
import db from "@/db";
import { gfoGraphRolloutSnapshotsTable } from "@/db/schemas";
import { sendPagerDutyAlert } from "@/lib/alerts/pagerduty";
import { sendSlackAlert } from "@/lib/alerts/slack";
import { sendEmailAlert } from "@/lib/alerts/email";
import { getGraphSearchMode, getGraphTrafficPercent } from "@/lib/graph/config";
import { redis } from "@/lib/redis";

async function getMetricSum(metricName: string, minutes: number): Promise<number> {
  const query = sql<{ total: number }>`
    SELECT COALESCE(SUM(metric_value), 0) AS total
    FROM gfo_graph_metrics_minute
    WHERE metric_name = ${metricName}
      AND bucket_start >= NOW() - make_interval(mins => ${minutes})
  `;
  const result = await db.execute(query);
  return Number(result.rows[0]?.total || 0);
}

async function getFallbackBaselinePerMinute(): Promise<number> {
  const query = sql<{ baseline: number }>`
    SELECT COALESCE(AVG(metric_value), 0) AS baseline
    FROM gfo_graph_metrics_minute
    WHERE metric_name = 'graph_fallback_count'
      AND bucket_start >= NOW() - INTERVAL '7 days'
      AND bucket_start < NOW() - INTERVAL '1 hour'
  `;
  const result = await db.execute(query);
  return Number(result.rows[0]?.baseline || 0);
}

async function shouldSendDedupedAlert(
  key: string,
  ttlSeconds: number
): Promise<boolean> {
  const result = await redis.set(
    `graph:alert:dedup:${key}`,
    String(Date.now()),
    "EX",
    ttlSeconds,
    "NX"
  );
  return result === "OK";
}

export async function graphAlertProcessor(): Promise<void> {
  const fallback5m = await getMetricSum("graph_fallback_count", 5);
  const attempts15m = await getMetricSum("graph_attempted_count", 15);
  const zeroExpansion15m = await getMetricSum("graph_zero_expansion_count", 15);
  const newCandidates24h = await getMetricSum("graph_new_candidates_found", 24 * 60);
  const baselineFallbackPerMinute = await getFallbackBaselinePerMinute();

  const fallbackThreshold = Math.max(100 * 5, baselineFallbackPerMinute * 5 * 5);
  if (
    fallback5m > fallbackThreshold &&
    await shouldSendDedupedAlert("fallback-spike", 5 * 60)
  ) {
    await sendPagerDutyAlert({
      summary: "Graph fallback volume spike detected",
      severity: "critical",
      customDetails: {
        fallback5m,
        fallbackThreshold,
        baselineFallbackPerMinute,
      },
    });
  }

  const zeroExpansionRate = attempts15m > 0 ? zeroExpansion15m / attempts15m : 0;
  if (
    attempts15m > 0 &&
    zeroExpansionRate > 0.2 &&
    await shouldSendDedupedAlert("zero-expansion", 15 * 60)
  ) {
    await sendSlackAlert({
      title: "Graph zero-expansion rate high",
      message: "graph_zero_expansion_rate exceeded 20% in the 15-minute window.",
      fields: {
        attempts15m,
        zeroExpansion15m,
        zeroExpansionRate: `${(zeroExpansionRate * 100).toFixed(2)}%`,
      },
    });
  }

  if (
    newCandidates24h <= 0 &&
    attempts15m > 0 &&
    await shouldSendDedupedAlert("no-new-candidates", 24 * 60 * 60)
  ) {
    await sendEmailAlert({
      subject: "Graph regression: no new candidates discovered in 24h",
      body: "graph_new_candidates_found has dropped to 0 for the last 24 hours.",
      tags: {
        attempts15m,
        newCandidates24h,
      },
    });
  }

  await db.insert(gfoGraphRolloutSnapshotsTable).values({
    mode: getGraphSearchMode(),
    trafficPercent: getGraphTrafficPercent(),
    blendVariant: process.env.GRAPH_BLEND_VARIANT || null,
    metadata: {
      fallback5m,
      fallbackThreshold,
      attempts15m,
      zeroExpansion15m,
      zeroExpansionRate,
      newCandidates24h,
    },
  });
}
