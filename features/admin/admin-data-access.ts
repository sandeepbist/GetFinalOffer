import { desc, sql, and, gte, eq } from "drizzle-orm";
import db from "@/db";
import {
  gfoUserTable,
  gfoCandidatesTable,
  gfoRecruitersTable,
  gfoContactsTable,
  gfoCandidateSkillsTable,
  gfoVerificationRequestsTable,
  gfoSearchLogsTable,
  gfoGraphMetricsMinuteTable,
  gfoGraphRolloutSnapshotsTable,
} from "@/db/schemas";
import { isAdminEmail } from "@/lib/auth/admin";
import type { AdminOverviewDTO, AdminAnalyticsDTO, AdminGraphHealthDTO } from "./admin-dto";
import { getCurrentUser } from "@/lib/auth/current-user";

export async function assertAdmin(): Promise<
  { ok: true; userId: string } | { ok: false }
> {
  const user = await getCurrentUser().catch(() => null);
  if (!user || !isAdminEmail(user.email)) {
    return { ok: false };
  }
  return { ok: true, userId: user.id };
}

export async function getAdminOverview(): Promise<AdminOverviewDTO> {
  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const [
    candidateCount,
    recruiterCount,
    pendingVerifications,
    searches24h,
    invites24h,
    indexedSkills,
  ] = await Promise.all([
    db.select({ count: sql<number>`count(*)::int` }).from(gfoCandidatesTable),
    db.select({ count: sql<number>`count(*)::int` }).from(gfoRecruitersTable),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(gfoVerificationRequestsTable)
      .where(eq(gfoVerificationRequestsTable.status, "pending")),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(gfoSearchLogsTable)
      .where(gte(gfoSearchLogsTable.createdAt, dayAgo)),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(gfoContactsTable)
      .where(gte(gfoContactsTable.contactedAt, dayAgo)),
    db.select({ count: sql<number>`count(distinct skill_id)::int` }).from(gfoCandidateSkillsTable),
  ]);

  const recentRequests = await db
    .select({
      id: gfoVerificationRequestsTable.id,
      scope: gfoVerificationRequestsTable.scope,
      subject: gfoVerificationRequestsTable.subject,
      status: gfoVerificationRequestsTable.status,
      requestedAt: gfoVerificationRequestsTable.requestedAt,
      requesterName: gfoUserTable.name,
    })
    .from(gfoVerificationRequestsTable)
    .innerJoin(
      gfoUserTable,
      eq(gfoUserTable.id, gfoVerificationRequestsTable.requestedByUserId)
    )
    .orderBy(desc(gfoVerificationRequestsTable.requestedAt))
    .limit(5);

  const recentSearches = await db
    .select({
      query: sql<string>`${gfoSearchLogsTable.metadata} ->> 'query'`,
      resultsCount: sql<number>`(${gfoSearchLogsTable.metadata} ->> 'resultsCount')::int`,
      createdAt: gfoSearchLogsTable.createdAt,
    })
    .from(gfoSearchLogsTable)
    .where(
      and(
        eq(gfoSearchLogsTable.eventType, "SEARCH"),
        sql`${gfoSearchLogsTable.metadata} ->> 'query' is not null`
      )
    )
    .orderBy(desc(gfoSearchLogsTable.createdAt))
    .limit(8);

  const fallbackRows = await db
    .select({
      fallback: sql<number>`coalesce(sum(case when metric_name = 'graph_fallback_count' then metric_value else 0 end), 0)::int`,
      attempted: sql<number>`coalesce(sum(case when metric_name = 'graph_attempted_count' then metric_value else 0 end), 0)::int`,
    })
    .from(gfoGraphMetricsMinuteTable)
    .where(gte(gfoGraphMetricsMinuteTable.bucketStart, dayAgo));

  const fallbackRate =
    fallbackRows[0] && fallbackRows[0].attempted > 0
      ? fallbackRows[0].fallback / fallbackRows[0].attempted
      : null;

  return {
    kpis: {
      candidates: candidateCount[0]?.count ?? 0,
      recruiters: recruiterCount[0]?.count ?? 0,
      pendingVerifications: pendingVerifications[0]?.count ?? 0,
      searches24h: searches24h[0]?.count ?? 0,
      invites24h: invites24h[0]?.count ?? 0,
      indexedSkillAssignments: indexedSkills[0]?.count ?? 0,
      graphFallbackRate24h: fallbackRate,
    },
    recentVerificationRequests: recentRequests.map((r) => ({
      ...r,
      requestedAt: r.requestedAt.toISOString(),
    })),
    recentSearches: recentSearches.map((r) => ({
      ...r,
      createdAt: (r.createdAt ?? new Date()).toISOString(),
    })),
  };
}

export async function getAdminAnalytics(days = 14): Promise<AdminAnalyticsDTO> {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const funnel = await db
    .select({
      eventType: gfoSearchLogsTable.eventType,
      count: sql<number>`count(*)::int`,
    })
    .from(gfoSearchLogsTable)
    .where(gte(gfoSearchLogsTable.createdAt, since))
    .groupBy(gfoSearchLogsTable.eventType);

  const funnelMap = new Map(funnel.map((f) => [f.eventType, f.count]));

  const daily = await db
    .select({
      day: sql<string>`to_char(${gfoSearchLogsTable.createdAt}, 'YYYY-MM-DD')`,
      eventType: gfoSearchLogsTable.eventType,
      count: sql<number>`count(*)::int`,
    })
    .from(gfoSearchLogsTable)
    .where(gte(gfoSearchLogsTable.createdAt, since))
    .groupBy(
      sql`to_char(${gfoSearchLogsTable.createdAt}, 'YYYY-MM-DD')`,
      gfoSearchLogsTable.eventType
    )
    .orderBy(sql`to_char(${gfoSearchLogsTable.createdAt}, 'YYYY-MM-DD')`);

  const daysMap = new Map<string, { searches: number; clicks: number; profileViews: number }>();
  for (const row of daily) {
    const entry =
      daysMap.get(row.day) ?? { searches: 0, clicks: 0, profileViews: 0 };
    if (row.eventType === "SEARCH") entry.searches = row.count;
    if (row.eventType === "CLICK") entry.clicks = row.count;
    if (row.eventType === "PROFILE_VIEW") entry.profileViews = row.count;
    daysMap.set(row.day, entry);
  }

  const topQueries = await db
    .select({
      query: sql<string>`${gfoSearchLogsTable.metadata} ->> 'query'`,
      count: sql<number>`count(*)::int`,
    })
    .from(gfoSearchLogsTable)
    .where(
      and(
        eq(gfoSearchLogsTable.eventType, "SEARCH"),
        gte(gfoSearchLogsTable.createdAt, since),
        sql`${gfoSearchLogsTable.metadata} ->> 'query' is not null`
      )
    )
    .groupBy(sql`${gfoSearchLogsTable.metadata} ->> 'query'`)
    .orderBy(desc(sql`count(*)`))
    .limit(10);

  return {
    windowDays: days,
    funnel: {
      searches: funnelMap.get("SEARCH") ?? 0,
      clicks: funnelMap.get("CLICK") ?? 0,
      profileViews: funnelMap.get("PROFILE_VIEW") ?? 0,
    },
    daily: Array.from(daysMap.entries())
      .map(([day, counts]) => ({ day, ...counts }))
      .sort((a, b) => a.day.localeCompare(b.day)),
    topQueries,
  };
}

export async function getAdminGraphHealth(hours = 24): Promise<AdminGraphHealthDTO> {
  const since = new Date(Date.now() - hours * 60 * 60 * 1000);

  const totals = await db
    .select({
      metricName: gfoGraphMetricsMinuteTable.metricName,
      total: sql<number>`sum(metric_value)::float`,
    })
    .from(gfoGraphMetricsMinuteTable)
    .where(gte(gfoGraphMetricsMinuteTable.bucketStart, since))
    .groupBy(gfoGraphMetricsMinuteTable.metricName);

  const totalsMap = new Map(totals.map((t) => [t.metricName, t.total]));

  const latencyRows = await db
    .select({
      p50: sql<number>`coalesce(percentile_cont(0.5) within group (order by metric_value), 0)::float`,
      p95: sql<number>`coalesce(percentile_cont(0.95) within group (order by metric_value), 0)::float`,
    })
    .from(gfoGraphMetricsMinuteTable)
    .where(
      and(
        eq(gfoGraphMetricsMinuteTable.metricName, "graph_latency_ms_sum"),
        gte(gfoGraphMetricsMinuteTable.bucketStart, since)
      )
    );

  const attempted = totalsMap.get("graph_attempted_count") ?? 0;
  const fallback = totalsMap.get("graph_fallback_count") ?? 0;
  const zeroExpansion = totalsMap.get("graph_zero_expansion_count") ?? 0;

  const rollouts = await db
    .select({
      mode: gfoGraphRolloutSnapshotsTable.mode,
      trafficPercent: gfoGraphRolloutSnapshotsTable.trafficPercent,
      blendVariant: gfoGraphRolloutSnapshotsTable.blendVariant,
      createdAt: gfoGraphRolloutSnapshotsTable.createdAt,
      metadata: gfoGraphRolloutSnapshotsTable.metadata,
    })
    .from(gfoGraphRolloutSnapshotsTable)
    .orderBy(desc(gfoGraphRolloutSnapshotsTable.createdAt))
    .limit(10);

  return {
    windowHours: hours,
    totals: {
      attempted,
      fallback,
      fallbackRate: attempted > 0 ? fallback / attempted : null,
      zeroExpansion,
      zeroExpansionRate: attempted > 0 ? zeroExpansion / attempted : null,
      newCandidatesFound: totalsMap.get("graph_new_candidates_found") ?? 0,
      graphSyncSuccess: totalsMap.get("graph_sync_success_count") ?? 0,
      graphSyncFailure: totalsMap.get("graph_sync_failure_count") ?? 0,
    },
    latency: latencyRows[0] ?? { p50: 0, p95: 0 },
    rollouts: rollouts.map((r) => ({
      ...r,
      createdAt: (r.createdAt ?? new Date()).toISOString(),
    })),
  };
}
