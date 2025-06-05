import db from "@/db";
import {
  gfoCandidatesTable,
  gfoCandidateSkillsTable,
  gfoCandidateInterviewProgressTable,
} from "@/db/schemas";
import type { InferModel } from "drizzle-orm";

export type CandidateRow = InferModel<typeof gfoCandidatesTable>;
export type CandidateSkillRow = InferModel<typeof gfoCandidateSkillsTable>;
export type InterviewProgressRow = InferModel<
  typeof gfoCandidateInterviewProgressTable
>;

export async function insertCandidate(data: {
  userId: string;
  professionalTitle: string;
  currentRole: string;
  yearsOfExperience: number;
  location: string;
  bio: string;
  resumeUrl: string;
}): Promise<CandidateRow> {
  const [created] = await db
    .insert(gfoCandidatesTable)
    .values({
      userId: data.userId,
      professionalTitle: data.professionalTitle,
      currentRole: data.currentRole,
      yearsExperience: data.yearsOfExperience,
      location: data.location,
      bio: data.bio,
      resumeUrl: data.resumeUrl,
    })
    .returning();
  return created;
}
export async function insertCandidateSkills(
  candidateUserId: string,
  skillIds: number[]
): Promise<void> {
  if (skillIds.length === 0) return;
  const records = skillIds.map((skillId) => ({
    candidateUserId,
    skillId,
  }));
  await db.insert(gfoCandidateSkillsTable).values(records);
}
export async function insertInterviewProgress(
  candidateUserId: string,
  entries: Array<{
    companyId: number;
    position: string;
    roundsCleared: number;
    totalRounds: number;
    status: string;
    dateCleared: Date;
  }>
): Promise<void> {
  if (entries.length === 0) return;
  const records = entries.map((entry) => ({
    candidateUserId,
    companyId: entry.companyId,
    position: entry.position,
    roundsCleared: entry.roundsCleared,
    totalRounds: entry.totalRounds,
    status: entry.status,
    dateCleared: entry.dateCleared,
  }));
  await db.insert(gfoCandidateInterviewProgressTable).values(records);
}
