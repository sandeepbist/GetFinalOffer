"use client";

import React from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { TUserAuth } from "@/lib/auth/auth-types";

interface RecruiterDashboardProps {
  user: TUserAuth;
}
export default function RecruiterDashboard({ user }: RecruiterDashboardProps) {
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome, {user.name}!
        </h1>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card className="rounded-xl shadow-lg bg-white">
          <CardHeader className="px-6 py-4">
            <CardTitle className="text-xl font-semibold text-gray-800">
              Candidates
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 py-4">
            <p className="text-sm text-gray-700">
              Browse and filter candidates who have verified their interview
              progress.
            </p>
          </CardContent>
          <CardFooter className="px-6 py-4">
            <Button asChild className="w-full" size="lg">
              <Link href="/recruiter/candidates">View Candidates</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
