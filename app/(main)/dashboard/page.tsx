"use client";

import React from "react";
import { useRouter } from "next/navigation";
import CandidateDashboard from "@/features/candidate/dashboard/CandidateDashboard";
import RecruiterDashboard from "@/features/recruiter/dashboard/RecruiterDashboard";
import { authClient } from "@/lib/auth/auth-client";
import type { TUserAuth } from "@/lib/auth/auth-types";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  if (!session?.user) {
    router.push("/auth");
    return null;
  }
  const user = session.user as TUserAuth;

  return (
    <>
      {user.role === "candidate" ? (
        <CandidateDashboard user={user} />
      ) : (
        <RecruiterDashboard user={user} />
      )}
    </>
  );
}
