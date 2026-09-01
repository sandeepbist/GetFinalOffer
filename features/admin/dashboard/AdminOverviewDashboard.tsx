"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  Search,
  Handshake,
  ClipboardCheck,
  Network,
  ShieldCheck,
  Clock,
} from "lucide-react";
import {
  getAdminOverview,
  type AdminOverviewDTO,
} from "@/features/admin/admin-use-cases";

function KpiCard({
  icon: Icon,
  label,
  value,
  sub,
  href,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  href?: string;
}) {
  const body = (
    <Card className="border-border/80 bg-surface transition-colors hover:border-border">
      <CardContent className="flex items-start justify-between p-5">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-text-subtle">
            {label}
          </p>
          <p className="text-2xl font-semibold text-heading">{value}</p>
          {sub && <p className="text-xs text-text-muted">{sub}</p>}
        </div>
        <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      </CardContent>
    </Card>
  );

  return href ? <Link href={href}>{body}</Link> : body;
}

export function AdminOverviewDashboard() {
  const [data, setData] = useState<AdminOverviewDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getAdminOverview()
      .then((overview) => {
        if (cancelled) return;
        if (!overview) setError(true);
        else setData(overview);
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
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <Card key={i} className="border-border/70">
              <CardContent className="h-24 animate-pulse rounded-xl bg-highlight" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <Card className="max-w-md border-border/80 bg-surface">
        <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
          <p className="text-sm font-medium text-heading">Could not load the overview</p>
          <p className="text-xs text-text-muted">
            The admin data failed to load. You may not have admin access, or the
            service is unreachable.
          </p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </CardContent>
      </Card>
    );
  }

  const { kpis } = data;
  const fallbackPct =
    kpis.graphFallbackRate24h !== null
      ? `${(kpis.graphFallbackRate24h * 100).toFixed(1)}%`
      : null;

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-heading">Overview</h1>
        <p className="text-sm text-text-muted">
          Last 24 hours, except where noted.
        </p>
      </header>

      {/* Exceptions first: pending verifications lead the grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          icon={ClipboardCheck}
          label="Pending verifications"
          value={kpis.pendingVerifications}
          sub={kpis.pendingVerifications > 0 ? "Needs review" : "Queue clear"}
          href="/admin/verification"
        />
        <KpiCard
          icon={Search}
          label="Searches"
          value={kpis.searches24h}
          sub="Last 24 hours"
          href="/admin/analytics"
        />
        <KpiCard
          icon={Handshake}
          label="Invites sent"
          value={kpis.invites24h}
          sub="Last 24 hours"
        />
        <KpiCard
          icon={Network}
          label="Graph fallback rate"
          value={fallbackPct ?? "—"}
          sub="Searches that fell back to baseline"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard icon={Users} label="Candidates" value={kpis.candidates} />
        <KpiCard
          icon={Users}
          label="Recruiters"
          value={kpis.recruiters}
        />
        <KpiCard
          icon={ShieldCheck}
          label="Skill assignments"
          value={kpis.indexedSkillAssignments}
          sub="Candidate-skill links"
        />
      </div>

      {data.recentVerificationRequests.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-text-subtle">
              Recent verification requests
            </h2>
            <Link
              href="/admin/verification"
              className="text-xs font-medium text-primary hover:underline"
            >
              Review all
            </Link>
          </div>
          <Card className="border-border/80 bg-surface">
            <CardContent className="divide-y divide-border/60 p-0">
              {data.recentVerificationRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between gap-4 px-5 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-heading">
                      {request.requesterName ?? "Unknown"} — {request.subject || request.scope}
                    </p>
                    <p className="flex items-center gap-1 text-xs text-text-muted">
                      <Clock className="h-3 w-3" aria-hidden="true" />
                      {new Date(request.requestedAt).toLocaleString()}
                    </p>
                  </div>
                  <Badge
                    className={
                      request.status === "pending"
                        ? "bg-amber-500/10 text-amber-600 border-amber-500/25"
                        : request.status === "approved"
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/25"
                          : "bg-red-500/10 text-red-600 border-red-500/25"
                    }
                  >
                    {request.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      )}

      {data.recentSearches.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-text-subtle">
            Recent recruiter searches
          </h2>
          <Card className="border-border/80 bg-surface">
            <CardContent className="divide-y divide-border/60 p-0">
              {data.recentSearches.map((search, i) => (
                <div
                  key={`${search.createdAt}-${i}`}
                  className="flex items-center justify-between gap-4 px-5 py-3"
                >
                  <p className="min-w-0 truncate text-sm text-heading">
                    {search.query || "(empty query)"}
                  </p>
                  <p className="shrink-0 text-xs text-text-muted">
                    {search.resultsCount} results ·{" "}
                    {new Date(search.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  );
}
