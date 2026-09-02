import { sql } from "drizzle-orm";
import db from "@/db";

/**
 * Retention and rollup for the unbounded analytics tables.
 *
 * - gfo_graph_metrics_minute: buckets older than MINUTE_RETENTION_DAYS are
 *   summed into gfo_graph_metrics_daily (one row per metric+day) and then
 *   deleted. Because minute rows are deleted after being rolled up, each
 *   source row contributes exactly once; re-runs are idempotent.
 * - gfo_search_logs: rows older than SEARCH_LOG_RETENTION_DAYS are deleted.
 *   Raw per-event detail has no analytical value beyond that horizon; the
 *   admin analytics read recent windows only.
 */

const MINUTE_RETENTION_DAYS = 7;
const SEARCH_LOG_RETENTION_DAYS = 90;

export interface RetentionResult {
  rolledUpDays: number;
  prunedMinuteRows: number;
  prunedSearchLogs: number;
}

export const runRetentionProcessor = async (): Promise<RetentionResult> => {
  // Roll the eligible minute buckets into daily rows. ON CONFLICT replaces
  // any existing daily row for the same (day, metric) — correct because the
  // minute rows are deleted right after, so a retry recomputes the same sum.
  const rollup = await db.execute(sql`
    with rolled as (
      insert into gfo_graph_metrics_daily (day, metric_name, metric_value, sample_count, created_at)
      select
        date_trunc('day', bucket_start),
        metric_name,
        sum(metric_value),
        count(*),
        now()
      from gfo_graph_metrics_minute
      where bucket_start < now() - make_interval(days => ${MINUTE_RETENTION_DAYS})
      group by 1, 2
      on conflict (day, metric_name) do update set
        metric_value = excluded.metric_value,
        sample_count = excluded.sample_count,
        created_at = now()
      returning 1
    )
    select count(*) as rolled_days from rolled
  `);

  const rolledUpDays = Number(rollup.rows[0]?.rolled_days ?? 0);

  const pruneMinute = await db.execute(sql`
    delete from gfo_graph_metrics_minute
    where bucket_start < now() - make_interval(days => ${MINUTE_RETENTION_DAYS})
  `);

  const pruneLogs = await db.execute(sql`
    delete from gfo_search_logs
    where created_at < now() - make_interval(days => ${SEARCH_LOG_RETENTION_DAYS})
  `);

  const result: RetentionResult = {
    rolledUpDays,
    prunedMinuteRows: pruneMinute.rowCount ?? 0,
    prunedSearchLogs: pruneLogs.rowCount ?? 0,
  };

  if (result.prunedMinuteRows > 0 || result.prunedSearchLogs > 0) {
    console.log(
      `[Retention] Rolled up ${result.rolledUpDays} day-metric rows; pruned ${result.prunedMinuteRows} minute rows and ${result.prunedSearchLogs} search logs`
    );
  }

  return result;
};
