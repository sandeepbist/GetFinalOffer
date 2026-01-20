import { redirect } from "next/navigation";
import CandidateDashboard from "@/features/candidate/dashboard/CandidateDashboard";
import RecruiterDashboard from "@/features/recruiter/dashboard/RecruiterDashboard";
import { getCurrentSession } from "@/lib/auth/current-user";
import type { TUserAuth } from "@/lib/auth/auth-types";

export default async function DashboardPage() {
  const session = await getCurrentSession();

  if (!session?.user) {
    redirect("/auth");
  }

  const user = session.user as TUserAuth;

  return user.role === "candidate" ? (
    <CandidateDashboard user={user} />
  ) : (
    <RecruiterDashboard user={user} />
  );
}