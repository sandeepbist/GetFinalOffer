import { NextRequest, NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import db from "@/db";
import {
  gfoCandidatesTable,
  gfoCandidateSkillsTable,
  gfoCandidateInterviewProgressTable,
  gfoUserTable,
} from "@/db/schemas";
import type {
  CandidateFullProfileDTO,
  CandidateProfileSummaryDTO,
} from "@/features/candidate/candidate-dto";
import { VerificationStatus } from "@/features/candidate/dashboard/components/VerifyCallout";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id: userId } = await context.params;

  const [cand] = await db
    .select({
      professionalTitle: gfoCandidatesTable.professionalTitle,
      currentRole: gfoCandidatesTable.currentRole,
      yearsExperience: gfoCandidatesTable.yearsExperience,
      location: gfoCandidatesTable.location,
      bio: gfoCandidatesTable.bio,
      resumeUrl: gfoCandidatesTable.resumeUrl,
      verificationStatus: gfoCandidatesTable.verificationStatus,
    })
    .from(gfoCandidatesTable)
    .where(eq(gfoCandidatesTable.userId, userId));

  if (!cand) {
    return NextResponse.json({ error: "Candidate not found" }, { status: 404 });
  }

  const skillRows = await db
    .select({ skillId: gfoCandidateSkillsTable.skillId })
    .from(gfoCandidateSkillsTable)
    .where(eq(gfoCandidateSkillsTable.candidateUserId, userId));

  const progressRows = await db
    .select({
      id: gfoCandidateInterviewProgressTable.id,
      companyId: gfoCandidateInterviewProgressTable.companyId,
      position: gfoCandidateInterviewProgressTable.position,
      roundsCleared: gfoCandidateInterviewProgressTable.roundsCleared,
      totalRounds: gfoCandidateInterviewProgressTable.totalRounds,
      status: gfoCandidateInterviewProgressTable.status,
      verificationStatus: gfoCandidateInterviewProgressTable.verificationStatus,
      dateCleared: sql<string>`to_char(${gfoCandidateInterviewProgressTable.dateCleared}, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')`,
    })
    .from(gfoCandidateInterviewProgressTable)
    .where(eq(gfoCandidateInterviewProgressTable.candidateUserId, userId));

  const [userRow] = await db
    .select({
      name: gfoUserTable.name,
      email: gfoUserTable.email,
      image: gfoUserTable.image,
    })
    .from(gfoUserTable)
    .where(eq(gfoUserTable.id, userId));

  const profileDTO: CandidateProfileSummaryDTO = {
    userId,
    professionalTitle: cand.professionalTitle ?? "",
    currentRole: cand.currentRole ?? "",
    yearsExperience: cand.yearsExperience,
    location: cand.location,
    bio: cand.bio ?? "",
    resumeUrl: cand.resumeUrl,
    verificationStatus: cand.verificationStatus as VerificationStatus,
    skillIds: skillRows.map((r) => r.skillId),
    interviewProgress: progressRows.map((r) => ({
      id: r.id,
      companyId: r.companyId,
      position: r.position,
      roundsCleared: r.roundsCleared,
      totalRounds: r.totalRounds,
      status: r.status,
      verificationStatus: r.verificationStatus as VerificationStatus,
      dateCleared: r.dateCleared,
    })),
  };

  const full: CandidateFullProfileDTO = {
    user: {
      name: userRow.name ?? "",
      email: userRow.email ?? "",
      image: userRow.image ?? "",
    },
    profile: profileDTO,
  };

  return NextResponse.json(full);
}
