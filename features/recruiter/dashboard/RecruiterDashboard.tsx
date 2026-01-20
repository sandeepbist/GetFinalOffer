"use client";

import React from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, ArrowRight, Sparkles } from "lucide-react";
import type { TUserAuth } from "@/lib/auth/auth-types";

export default function RecruiterDashboard({ user }: { user: TUserAuth }) {
  return (
    <main className="min-h-screen bg-white p-8 space-y-8">

      <div className="max-w-5xl mx-auto space-y-1">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Welcome back, {user.name}
        </h1>
        <p className="text-slate-500">
          Manage your organization and find talent.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">

        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <Search className="w-5 h-5 text-blue-600" />
              Talent Search
            </CardTitle>
            <CardDescription>
              Access our AI-powered candidate database.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 flex items-start gap-4">
              <div className="p-2 bg-white rounded-md shadow-sm text-blue-600">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-medium text-slate-900 text-sm">Semantic Search Active</h4>
                <p className="text-xs text-slate-500 mt-1">
                  You can search for &quot;React developers with 3 years exp&quot; instead of just keywords.
                </p>
              </div>
            </div>

            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20">
              <Link href="/recruiter/candidates">
                Go to Search <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm opacity-60 bg-slate-50/50">
          <CardHeader>
            <CardTitle className="text-slate-500">Analytics (Coming Soon)</CardTitle>
            <CardDescription>
              Track profile views and candidate interactions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-24 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-lg">
              <p className="text-xs text-slate-400 font-medium">No data available</p>
            </div>
          </CardContent>
        </Card>

      </div>
    </main>
  );
}