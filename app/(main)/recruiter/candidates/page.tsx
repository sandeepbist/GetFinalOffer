import { redirect } from "next/navigation";
import CandidateSearch from "@/features/jobs/components/CandidateSearch";
import { getCurrentSession } from "@/lib/auth/current-user";

export default async function RecruiterCandidatesPage() {
  const session = await getCurrentSession();

  if (!session?.user) {
    redirect("/auth");
  }

  const role = (session.user as { role?: string }).role;
  if (role !== "recruiter") {
    // Candidates never see the search UI at all; the API re-checks the
    // recruiter row on every request — this only avoids rendering a page
    // that would error on first query for a non-recruiter.
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen pt-4">
      <div>
        <CandidateSearch />
      </div>
    </main>
  );
}
