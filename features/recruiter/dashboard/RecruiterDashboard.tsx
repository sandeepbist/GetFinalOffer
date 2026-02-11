"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, ArrowRight, Sparkles, Users, Clock3, CheckCircle2 } from "lucide-react";
import type { TUserAuth } from "@/lib/auth/auth-types";
import { getRecruiterContacts } from "@/features/contacts/contact-use-cases";
import type { RecruiterContactDTO } from "@/features/contacts/contact-dto";
import { useCachedFetch } from "@/hooks/use-cached-fetch";

/* ── Animation helpers ── */
const ease = [0.22, 1, 0.36, 1] as const;
const stagger = (i: number) => ({ duration: 0.5, delay: 0.05 + i * 0.08, ease });

function FadeUp({ children, index = 0, className }: { children: React.ReactNode; index?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={stagger(index)}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Metric Skeleton ── */
function MetricSkeleton() {
  return (
    <div className="rounded-xl border border-border/80 bg-background/65 p-4">
      <Skeleton className="h-3 w-16 rounded" />
      <Skeleton className="mt-3 h-7 w-10 rounded" />
    </div>
  );
}

/* ── Dashboard Skeleton ── */
function DashboardSkeleton() {
  return (
    <main className="min-h-screen bg-section px-6 py-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-7">
        <Card className="overflow-hidden border-border/80">
          <CardContent className="grid gap-6 p-7 md:grid-cols-[1.4fr_1fr]">
            <div className="space-y-2.5">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-8 w-64 rounded-xl" />
              <Skeleton className="h-4 w-80" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <MetricSkeleton />
              <MetricSkeleton />
              <MetricSkeleton />
              <MetricSkeleton />
            </div>
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Skeleton className="h-60 rounded-2xl lg:col-span-2" />
          <Skeleton className="h-60 rounded-2xl" />
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    </main>
  );
}

export default function RecruiterDashboard({ user }: { user: TUserAuth }) {
  const { data: contacts, loading } = useCachedFetch<RecruiterContactDTO[]>(
    "recruiter-contacts",
    getRecruiterContacts
  );

  const acceptedCount = useMemo(
    () => (contacts ?? []).filter((c) => c.status === "accepted").length,
    [contacts]
  );
  const pendingCount = useMemo(
    () => (contacts ?? []).filter((c) => c.status === "pending").length,
    [contacts]
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "accepted":
        return (
          <Badge className="border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
            Accepted
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="border-destructive/30 bg-destructive/10 text-destructive">
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="border-border/80 bg-highlight text-text-muted">
            Pending
          </Badge>
        );
    }
  };

  if (loading && !contacts) return <DashboardSkeleton />;

  const contactList = contacts ?? [];

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease }}
      className="min-h-screen bg-section px-6 py-8"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-7">
        {/* ── Welcome Card ── */}
        <FadeUp index={0}>
          <Card className="overflow-hidden border-border/80 bg-linear-to-br from-surface via-surface to-highlight/60">
            <CardContent className="grid gap-6 p-7 md:grid-cols-[1.4fr_1fr]">
              <div className="space-y-2.5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-text-subtle">
                  Recruiter Workspace
                </p>
                <h1 className="text-3xl font-bold tracking-tight text-heading">
                  Welcome back, {user.name}
                </h1>
                <p className="max-w-xl text-sm text-text-muted">
                  Review outreach activity, discover high-signal candidates, and move faster with focused search.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Outreach", value: contactList.length },
                  { label: "Accepted", value: acceptedCount },
                  { label: "Pending", value: pendingCount },
                  { label: "Pipeline", value: contactList.length === 0 ? "New" : "Active" },
                ].map((m, i) => (
                  <motion.div
                    key={m.label}
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.2 + i * 0.06, ease }}
                    className="rounded-xl border border-border/80 bg-background/65 p-4"
                  >
                    <p className="text-xs font-medium uppercase tracking-wide text-text-subtle">{m.label}</p>
                    <p className="mt-2 text-2xl font-semibold text-heading">{m.value}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </FadeUp>

        {/* ── Search + Response Grid ── */}
        <FadeUp index={2} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="border-border/80 bg-surface lg:col-span-2">
            <CardHeader className="border-b border-border/70 pb-4">
              <CardTitle className="flex items-center gap-2 text-heading">
                <Search className="h-5 w-5 text-primary" />
                Talent Search
              </CardTitle>
              <CardDescription>
                Access AI-ranked candidates with semantic matching and verified interview history.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-5">
              <div className="rounded-xl border border-border/70 bg-highlight/70 p-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-md border border-border/70 bg-surface p-2 text-primary">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-semibold text-heading">Semantic search is live</h3>
                    <p className="text-xs leading-relaxed text-text-muted">
                      Search naturally, like &ldquo;React engineers with product and scaling experience,&rdquo; and surface stronger fits faster.
                    </p>
                  </div>
                </div>
              </div>

              <Button asChild className="h-10 w-full">
                <Link href="/recruiter/candidates">
                  Open Candidate Search <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/80 bg-surface">
            <CardHeader className="border-b border-border/70 pb-4">
              <CardTitle className="flex items-center gap-2 text-heading">
                <Clock3 className="h-5 w-5 text-primary" />
                Response Snapshot
              </CardTitle>
              <CardDescription>Live summary of recent outreach responses.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-5">
              {[
                { label: "Pending", value: pendingCount },
                { label: "Accepted", value: acceptedCount },
                { label: "Total", value: contactList.length },
              ].map((r) => (
                <div key={r.label} className="flex items-center justify-between rounded-lg border border-border/70 bg-highlight/70 px-3 py-2.5">
                  <span className="text-sm text-text-muted">{r.label}</span>
                  <span className="text-sm font-semibold text-heading">{r.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </FadeUp>

        {/* ── Recent Outreach ── */}
        <FadeUp index={4}>
          <Card className="border-border/80 bg-surface">
            <CardHeader className="border-b border-border/70 pb-4">
              <CardTitle className="flex items-center gap-2 text-heading">
                <Users className="h-5 w-5 text-primary" />
                Recent Outreach
              </CardTitle>
              <CardDescription>Latest candidates contacted by your team.</CardDescription>
            </CardHeader>
            <CardContent className="pt-5">
              {contactList.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border/80 bg-highlight/60 py-10 text-center">
                  <p className="text-sm font-medium text-heading">No outreach yet</p>
                  <p className="mt-1 text-sm text-text-muted">
                    Start a search and invite high-fit candidates to begin your pipeline.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {contactList.map((contact, i) => (
                    <motion.div
                      key={contact.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: 0.3 + i * 0.04, ease }}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/80 bg-highlight/65 px-4 py-3"
                    >
                      <div className="min-w-0 space-y-0.5">
                        <p className="truncate text-sm font-semibold text-heading">{contact.candidateName}</p>
                        <p className="truncate text-xs text-text-muted">{contact.candidateTitle}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-1.5 text-xs text-text-subtle">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          {new Date(contact.contactedAt).toLocaleDateString()}
                        </span>
                        {getStatusBadge(contact.status)}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </FadeUp>
      </div>
    </motion.main>
  );
}
