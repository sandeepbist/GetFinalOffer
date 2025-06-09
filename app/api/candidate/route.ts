import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import fs from "fs";
import path from "path";
import { eq, inArray } from "drizzle-orm";
import { randomUUID } from "crypto";
import db from "@/db";
import {
  gfoCandidatesTable,
  gfoCandidateSkillsTable,
  gfoCandidateInterviewProgressTable,
} from "@/db/schemas";
import type {
  CreateCandidateProfileResponseDTO,
  InterviewProgressEntryDTO,
  CandidateProfileSummaryDTO,
} from "@/features/candidate/candidate-dto";
import { betterFetch } from "@better-fetch/fetch";
import { VerificationStatus } from "@/features/candidate/dashboard/components/VerifyCallout";

export const config = { api: { bodyParser: false } };

async function getUserId(req: NextRequest): Promise<string> {
  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: req.nextUrl.origin,
      headers: {
        cookie: req.headers.get("cookie") || "",
      },
    }
  );
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }
  return session.user.id;
}
export async function GET(req: NextRequest) {
  let userId: string;
  try {
    userId = await getUserId(req);
  } catch {
    return NextResponse.json(null, { status: 401 });
  }

  const [candidate] = await db
    .select()
    .from(gfoCandidatesTable)
    .where(eq(gfoCandidatesTable.userId, userId));

  if (!candidate) {
    return NextResponse.json(null, { status: 200 });
  }

  const skillRows = await db
    .select()
    .from(gfoCandidateSkillsTable)
    .where(eq(gfoCandidateSkillsTable.candidateUserId, userId));

  const progressRows = await db
    .select()
    .from(gfoCandidateInterviewProgressTable)
    .where(eq(gfoCandidateInterviewProgressTable.candidateUserId, userId));

  const summary: CandidateProfileSummaryDTO = {
    userId,
    professionalTitle: candidate.professionalTitle ?? "",
    currentRole: candidate.currentRole ?? "",
    yearsExperience: candidate.yearsExperience,
    location: candidate.location,
    bio: candidate.bio ?? "",
    verificationStatus: candidate.verificationStatus as VerificationStatus,
    resumeUrl: candidate.resumeUrl,
    skillIds: skillRows.map((r) => r.skillId),
    interviewProgress: progressRows.map((r) => ({
      id: r.id,
      companyId: r.companyId,
      position: r.position,
      roundsCleared: r.roundsCleared,
      totalRounds: r.totalRounds,
      status: r.status,
      verificationStatus: r.verificationStatus as VerificationStatus,
      dateCleared: r.dateCleared.toISOString(),
    })),
  };

  return NextResponse.json(summary);
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const userId = form.get("userId")!.toString();
    const professionalTitle = form.get("professionalTitle")!.toString();
    const currentRole = form.get("currentRole")!.toString();
    const yearsExperience = parseInt(
      form.get("yearsExperience")!.toString(),
      10
    );
    const location = form.get("location")!.toString();
    const bio = form.get("bio")!.toString();
    const skillIds = JSON.parse(form.get("skillIds")!.toString()) as number[];
    const interviewProgress = JSON.parse(
      form.get("interviewProgress")!.toString()
    ) as InterviewProgressEntryDTO[];

    const resumeFile = form.get("resume") as File;
    if (!resumeFile) throw new Error("Resume required");

    const buffer = Buffer.from(await resumeFile.arrayBuffer());
    const uploads = path.join(process.cwd(), "public", "uploads", "resumes");
    if (!fs.existsSync(uploads)) fs.mkdirSync(uploads, { recursive: true });
    const filename = `${Date.now()}-${resumeFile.name}`;
    await fs.promises.writeFile(path.join(uploads, filename), buffer);
    const resumeUrl = `/uploads/resumes/${filename}`;

    await db.insert(gfoCandidatesTable).values({
      userId,
      professionalTitle,
      currentRole,
      yearsExperience,
      location,
      bio,
      resumeUrl,
    });

    if (skillIds.length) {
      await db.insert(gfoCandidateSkillsTable).values(
        skillIds.map((id) => ({
          id: randomUUID(),
          candidateUserId: userId,
          skillId: id.toString(),
        }))
      );
    }

    if (interviewProgress.length) {
      await db.insert(gfoCandidateInterviewProgressTable).values(
        interviewProgress.map((e) => ({
          id: randomUUID(),
          candidateUserId: userId,
          companyId: e.companyId,
          position: e.position,
          roundsCleared: e.roundsCleared,
          totalRounds: e.totalRounds,
          status: e.status,
          verificationStatus: e.verificationStatus,
          dateCleared: new Date(e.dateCleared),
        }))
      );
    }

    const resp: CreateCandidateProfileResponseDTO = { success: true };
    return NextResponse.json(resp);
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 400 }
    );
  }
}

export async function PUT(req: NextRequest) {
  let userId: string;
  try {
    userId = await getUserId(req);
  } catch {
    return NextResponse.json(
      { success: false, error: "Not authenticated" },
      { status: 401 }
    );
  }

  const body = await req.json();

  await db
    .insert(gfoCandidatesTable)
    .values({
      userId,
      professionalTitle: body.professionalTitle,
      currentRole: body.currentRole,
      yearsExperience: body.yearsExperience,
      location: body.location,
      bio: body.bio,
      resumeUrl: body.resumeUrl ?? "",
      verificationStatus: body.verificationStatus ?? "unverified",
    })
    .onConflictDoUpdate({
      target: gfoCandidatesTable.userId,
      set: {
        professionalTitle: body.professionalTitle,
        currentRole: body.currentRole,
        yearsExperience: body.yearsExperience,
        location: body.location,
        bio: body.bio,
        ...(body.resumeUrl && { resumeUrl: body.resumeUrl }),
      },
    });

  await db
    .delete(gfoCandidateSkillsTable)
    .where(eq(gfoCandidateSkillsTable.candidateUserId, userId));
  if (Array.isArray(body.skillIds) && body.skillIds.length) {
    await db.insert(gfoCandidateSkillsTable).values(
      body.skillIds.map((sid: number) => ({
        candidateUserId: userId,
        skillId: sid.toString(),
      }))
    );
  }

  return NextResponse.json({ success: true });
}

export async function PATCH(req: NextRequest) {
  let userId: string;
  try {
    userId = await getUserId(req);
  } catch {
    return NextResponse.json(
      { success: false, error: "Not auth" },
      { status: 401 }
    );
  }

  const { action, progress } = await req.json();
  if (action !== "progress") {
    return NextResponse.json(
      { success: false, error: "Unknown action" },
      { status: 400 }
    );
  }

  const incoming = progress as InterviewProgressEntryDTO[];

  const existingRows = await db
    .select({ id: gfoCandidateInterviewProgressTable.id })
    .from(gfoCandidateInterviewProgressTable)
    .where(eq(gfoCandidateInterviewProgressTable.candidateUserId, userId));
  const existingIds = existingRows.map((r) => r.id);

  const incomingIds = incoming.map((e) => e.id);

  const toDelete = existingIds.filter((id) => !incomingIds.includes(id));
  if (toDelete.length > 0) {
    await db
      .delete(gfoCandidateInterviewProgressTable)
      .where(inArray(gfoCandidateInterviewProgressTable.id, toDelete));
  }

  for (const e of incoming) {
    if (existingIds.includes(e.id)) {
      await db
        .update(gfoCandidateInterviewProgressTable)
        .set({
          companyId: e.companyId,
          position: e.position,
          roundsCleared: e.roundsCleared,
          totalRounds: e.totalRounds,
          status: e.status,
          verificationStatus: e.verificationStatus,
          dateCleared: new Date(e.dateCleared),
        })
        .where(eq(gfoCandidateInterviewProgressTable.id, e.id));
    } else {
      await db.insert(gfoCandidateInterviewProgressTable).values({
        id: e.id,
        candidateUserId: userId,
        companyId: e.companyId,
        position: e.position,
        roundsCleared: e.roundsCleared,
        totalRounds: e.totalRounds,
        status: e.status,
        verificationStatus: e.verificationStatus,
        dateCleared: new Date(e.dateCleared),
      });
    }
  }

  return NextResponse.json({ success: true });
}
