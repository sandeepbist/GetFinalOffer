"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, Database, Timer } from "lucide-react";
import {
  getAdminGraphHealth,
  type AdminGraphHealthDTO,
} from "@/features/admin/admin-use-cases";

const WINDOWS = [
  { hours: 24, label: "24 hours" },
  { hours: 72, label: "3 days" },
  { hours: 168, label: "7 days" },
];

function pct(value: number | null): string {
  return value === null ? "—" : `${(value * 100).toFixed(1)}%`;
}

function Guardrail({
  label,
  value,
  warn,
  sub,
}: {
  label: string;
  value: string;
  warn?: boolean;
  sub?: string;
}) {
  return (
    <Card className="border-border/80 bg-surface">
      <CardContent className="space-y-2 p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-text-subtle">
          {label}
        </p>
        <p
          className={`text-2xl font-semibold ${
            warn ? "text-amber-600" : "text-heading"
          }`}
        >
          {value}
        </p>
        {sub && <p className="text-xs text-text-muted">{sub}</p>}
      </CardContent>
    </Card>
  );
}

export function AdminGraphHealthDashboard() {
  const [hours, setHours] = useState(24);
  const [data, setData] = useState<AdminGraphHealthDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getAdminGraphHealth(hours)
      .then((health) => {
        if (cancelled) return;
        if (!health) setError(true);
        else {
          setData(health);
          setError(false);
        }
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [hours]);

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-heading">System</h1>
          <p className="text-sm text-text-muted">
            Graph search health: guardrail metrics, latency, and rollout history.
          </p>
        </div>
        <div className="flex gap-1 rounded-lg border border-border/70 bg-surface p-1">
          {WINDOWS.map((w) => (
            <button
              key={w.hours}
              onClick={() => setHours(w.hours)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                hours === w.hours
                  ? "bg-primary/10 text-primary"
                  : "text-text-muted hover:text-heading"
              }`}
            >
              {w.label}
            </button>
          ))}
        </div>
      </header>

      {loading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <Card key={i} className="border-border/70">
              <CardContent className="h-24 animate-pulse rounded-xl bg-highlight" />
            </Card>
          ))}
        </div>
      )}

      {error && !loading && (
        <Card className="max-w-md border-border/80 bg-surface">
          <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
            <p className="text-sm font-medium text-heading">Could not load system health</p>
            <Button onClick={() => setHours(hours)}>Retry</Button>
          </CardContent>
        </Card>
      )}

      {data && !loading && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Guardrail
              label="Fallback rate"
              value={pct(data.totals.fallbackRate)}
              warn={(data.totals.fallbackRate ?? 0) > 0.2}
              sub={`${data.totals.fallback} of ${data.totals.attempted} searches`}
            />
            <Guardrail
              label="Zero-expansion rate"
              value={pct(data.totals.zeroExpansionRate)}
              warn={(data.totals.zeroExpansionRate ?? 0) > 0.2}
              sub={`${data.totals.zeroExpansion} searches found no skills`}
            />
            <Guardrail
              label="New candidates found"
              value={String(data.totals.newCandidatesFound)}
              sub="Via graph expansion"
            />
            <Guardrail
              label="Graph sync"
              value={`${data.totals.graphSyncSuccess}/${data.totals.graphSyncSuccess + data.totals.graphSyncFailure}`}
              warn={data.totals.graphSyncFailure > 0}
              sub="Successful / total syncs"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="border-border/80 bg-surface">
              <CardHeader className="border-b border-border/70 pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Timer className="h-4 w-4 text-primary" aria-hidden="true" />
                  Graph expansion latency
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-5">
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">p50</span>
                  <span className="font-semibold text-heading">
                    {data.latency.p50.toFixed(0)} ms
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">p95</span>
                  <span className="font-semibold text-heading">
                    {data.latency.p95.toFixed(0)} ms
                  </span>
                </div>
                <p className="text-xs text-text-subtle">
                  Averaged over per-minute metric buckets in the selected window.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/80 bg-surface">
              <CardHeader className="border-b border-border/70 pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Activity className="h-4 w-4 text-primary" aria-hidden="true" />
                  Rollout snapshots
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {data.rollouts.length === 0 ? (
                  <p className="px-5 py-8 text-center text-sm text-text-muted">
                    No rollout snapshots recorded yet.
                  </p>
                ) : (
                  <div className="divide-y divide-border/60">
                    {data.rollouts.map((rollout) => (
                      <div
                        key={rollout.createdAt}
                        className="flex items-center justify-between px-5 py-3"
                      >
                        <div className="flex items-center gap-2">
                          <Badge className="bg-primary/10 text-primary border-primary/25">
                            {rollout.mode}
                          </Badge>
                          <span className="text-sm text-text">
                            {rollout.trafficPercent}% traffic
                          </span>
                        </div>
                        <span className="text-xs text-text-muted">
                          {new Date(rollout.createdAt).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <p className="flex items-center gap-1.5 text-xs text-text-subtle">
            <Database className="h-3 w-3" aria-hidden="true" />
            Metrics are flushed from Redis to Postgres by the metrics worker
            every minute; the newest minute may be missing.
          </p>
        </>
      )}
    </div>
  );
}
