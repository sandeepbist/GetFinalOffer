"use client";

import React, { useEffect, useState } from "react";
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
import { Search, ArrowRight, Sparkles, Users } from "lucide-react";
import type { TUserAuth } from "@/lib/auth/auth-types";
import { getRecruiterContacts } from "@/features/contacts/contact-use-cases";
import type { RecruiterContactDTO } from "@/features/contacts/contact-dto";

export default function RecruiterDashboard({ user }: { user: TUserAuth }) {
  const [contacts, setContacts] = useState<RecruiterContactDTO[]>([]);

  useEffect(() => {
    getRecruiterContacts().then(setContacts);
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "accepted":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20 border shadow-sm">
            Accepted
          </Badge>
        );
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return (
          <Badge variant="outline" className="text-text-muted bg-highlight">
            Pending
          </Badge>
        );
    }
  };

  return (
    <main className="min-h-screen bg-section p-8 space-y-8">
      <div className="max-w-5xl mx-auto space-y-1">
        <h1 className="text-3xl font-bold text-heading tracking-tight">
          Welcome back, {user.name}
        </h1>
        <p className="text-text-muted">
          Manage your organization and find talent.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border shadow-sm hover:shadow-md transition-shadow group bg-surface">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-heading">
              <Search className="w-5 h-5 text-primary" />
              Talent Search
            </CardTitle>
            <CardDescription>
              Access our AI-powered candidate database.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-highlight rounded-lg border border-border flex items-start gap-4">
              <div className="p-2 bg-surface rounded-md shadow-sm text-primary">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-medium text-heading text-sm">
                  Semantic Search Active
                </h4>
                <p className="text-xs text-text-muted mt-1">
                  You can search for &quot;React developers with 3 years exp&quot;
                  instead of just keywords.
                </p>
              </div>
            </div>

            <Button
              asChild
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
            >
              <Link href="/recruiter/candidates">
                Go to Search <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm opacity-60 bg-highlight">
          <CardHeader>
            <CardTitle className="text-text-muted">
              Analytics (Coming Soon)
            </CardTitle>
            <CardDescription>
              Track profile views and candidate interactions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-24 flex items-center justify-center border-2 border-dashed border-border rounded-lg">
              <p className="text-xs text-text-subtle font-medium">
                No data available
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="max-w-5xl mx-auto">
        <Card className="border-border shadow-sm bg-surface">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-heading">
              <Users className="w-5 h-5 text-purple-500" />
              Recent Outreach
            </CardTitle>
          </CardHeader>
          <CardContent>
            {contacts.length === 0 ? (
              <div className="text-center py-8 text-text-muted text-sm">
                You haven&apos;t contacted any candidates yet.
              </div>
            ) : (
              <div className="space-y-3">
                {contacts.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between p-3 border border-border rounded-lg bg-highlight"
                  >
                    <div>
                      <p className="font-semibold text-heading text-sm">
                        {c.candidateName}
                      </p>
                      <p className="text-xs text-text-muted">{c.candidateTitle}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-text-subtle">
                        {new Date(c.contactedAt).toLocaleDateString()}
                      </span>
                      {getStatusBadge(c.status)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}