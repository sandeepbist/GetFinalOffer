"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, MousePointerClick, Eye, ArrowRight } from "lucide-react";
import {
  getAdminAnalytics,
  type AdminAnalyticsDTO,
} from "@/features/admin/admin-use-cases";

const WINDOWS = [
  { days: 7, label: "7 days" },
  { days: 14, label: "14 days" },
  { days: 30, label: "30 days" },
];

function rate(part: number, whole: number): string {
  if (whole === 0) return "—";
  return `${((part / whole) * 100).toFixed(1)}%`;
}

export function AdminAnalyticsDashboard() {
  const [days, setDays] = useState(14);
  const [data, setData] = useState<AdminAnalyticsDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getAdminAnalytics(days)
      .then((analytics) => {
        if (cancelled) return;
        if (!analytics) setError(true);
        else {
          setData(analytics);
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
  }, [days]);

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-heading">Analytics</h1>
          <p className="text-sm text-text-muted">
            Recruiter search funnel and query demand.
          </p>
        </div>
        <div className="flex gap-1 rounded-lg border border-border/70 bg-surface p-1">
          {WINDOWS.map((w) => (
            <button
              key={w.days}
              onClick={() => setDays(w.days)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                days === w.days
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
        <div className="grid gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Card key={i} className="border-border/70">
              <CardContent className="h-32 animate-pulse rounded-xl bg-highlight" />
            </Card>
          ))}
        </div>
      )}

      {error && !loading && (
        <Card className="max-w-md border-border/80 bg-surface">
          <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
            <p className="text-sm font-medium text-heading">Could not load analytics</p>
            <Button onClick={() => setDays(days)}>Retry</Button>
          </CardContent>
        </Card>
      )}

      {data && !loading && (
        <>
          {/* Funnel as rates, per NNGroup: rates beat raw totals */}
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: Search,
                label: "Searches",
                value: data.funnel.searches,
                sub: "Total queries",
              },
              {
                icon: MousePointerClick,
                label: "Result clicks",
                value: data.funnel.clicks,
                sub: `${rate(data.funnel.clicks, data.funnel.searches)} of searches`,
              },
              {
                icon: Eye,
                label: "Profile views",
                value: data.funnel.profileViews,
                sub: `${rate(data.funnel.profileViews, data.funnel.searches)} of searches`,
              },
            ].map((step) => {
              const Icon = step.icon;
              return (
                <Card key={step.label} className="border-border/80 bg-surface">
                  <CardContent className="space-y-2 p-5">
                    <div className="flex items-center gap-2 text-text-muted">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                      <p className="text-xs font-medium uppercase tracking-wide text-text-subtle">
                        {step.label}
                      </p>
                    </div>
                    <p className="text-2xl font-semibold text-heading">{step.value}</p>
                    <p className="text-xs text-text-muted">{step.sub}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <section className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-text-subtle">
              Daily searches
            </h2>
            <Card className="border-border/80 bg-surface">
              <CardContent className="p-0">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/70 text-left text-xs uppercase tracking-wide text-text-subtle">
                      <th className="px-5 py-3 font-medium">Day</th>
                      <th className="px-5 py-3 font-medium">Searches</th>
                      <th className="px-5 py-3 font-medium">Clicks</th>
                      <th className="px-5 py-3 font-medium">Profile views</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.daily.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-5 py-8 text-center text-text-muted">
                          No search activity in this window.
                        </td>
                      </tr>
                    )}
                    {data.daily.map((day) => {
                      const max = Math.max(
                        ...data.daily.map((d) => d.searches),
                        1
                      );
                      return (
                        <tr key={day.day} className="border-b border-border/50 last:border-0">
                          <td className="px-5 py-2.5 text-text-muted">{day.day}</td>
                          <td className="px-5 py-2.5">
                            <div className="flex items-center gap-2">
                              <div
                                className="h-1.5 rounded-full bg-primary/60"
                                style={{ width: `${(day.searches / max) * 100}px` }}
                                aria-hidden="true"
                              />
                              <span className="font-medium text-heading">{day.searches}</span>
                            </div>
                          </td>
                          <td className="px-5 py-2.5 text-text">{day.clicks}</td>
                          <td className="px-5 py-2.5 text-text">{day.profileViews}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </section>

          {data.topQueries.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-text-subtle">
                Top queries
              </h2>
              <Card className="border-border/80 bg-surface">
                <CardContent className="p-0">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/70 text-left text-xs uppercase tracking-wide text-text-subtle">
                        <th className="px-5 py-3 font-medium">Query</th>
                        <th className="px-5 py-3 text-right font-medium">Searches</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.topQueries.map((q) => (
                        <tr key={q.query} className="border-b border-border/50 last:border-0">
                          <td className="px-5 py-2.5 text-heading">{q.query || "(empty)"}</td>
                          <td className="px-5 py-2.5 text-right font-medium text-heading">
                            {q.count}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </section>
          )}

          <p className="flex items-center gap-1.5 text-xs text-text-subtle">
            <ArrowRight className="h-3 w-3" aria-hidden="true" />
            Invites are tracked per outreach, not per search; see the Overview
            page for the last 24 hours.
          </p>
        </>
      )}
    </div>
  );
}
