import type { NextRequest } from "next/server";
import { eq, and, inArray } from "drizzle-orm";
import { z } from "zod";
import db from "@/db";
import {
  gfoCandidatesTable,
  gfoCandidateSkillsTable,
  gfoSkillsLibraryTable,
  gfoCandidateInterviewProgressTable,
  gfoCandidateHiddenOrganisationsTable,
  gfoVerificationRequestsTable,
  gfoVerificationDocumentsTable,
} from "@/db/schemas";
import type {
  CandidateProfileSummaryDTO,
} from "@/features/candidate/candidate-dto";
import { VerificationStatus } from "@/features/candidate/dashboard/components/VerifyCallout";
import { supabase } from "@/lib/supabase";
import { resumeQueue } from "@/lib/queue";
import { queueProfileSync } from "@/lib/sync-buffer";
import { queueGraphSync } from "@/lib/graph/sync";
import { getCurrentUserId } from "@/lib/auth/current-user";
import { removeVerificationDocs } from "@/lib/verification-storage";
import { ApiErrors, successResponse } from "@/features/common/api/response";
import { validateFile } from "@/features/common/api/file-validation";
import {
  candidateProfileSchema,
  candidateProfileUpdateSchema,
  interviewProgressEntrySchema,
  zodFieldErrors,
} from "@/features/common/api/validation";

async function handleResumeUpload(userId: string, file: File, bio: string) {
  const filename = `${userId}-${Date.now()}-${file.name.replace(
    /[^a-zA-Z0-9.-]/g,
    ""
  )}`;
  const { error: uploadError } = await supabase.storage
    .from("Resume")
    .upload(filename, file, { cacheControl: "3600", upsert: false });

  if (uploadError) throw new Error(`Storage Error: ${uploadError.message}`);

  const { data: publicUrlData } = supabase.storage
    .from("Resume")
    .getPublicUrl(filename);
  const resumeUrl = publicUrlData.publicUrl;

  await resumeQueue.add("process-resume", {
    userId,
    resumeUrl: resumeUrl,
    bio,
  });

  return resumeUrl;
}

export async function GET() {
  let userId: string;
  try {
    userId = await getCurrentUserId();
  } catch {
    return ApiErrors.unauthorized();
  }

  const [candidate] = await db
    .select()
    .from(gfoCandidatesTable)
    .where(eq(gfoCandidatesTable.userId, userId));

  if (!candidate) {
    return successResponse(null);
  }

  const skillRows = await db
    .select({
      skillId: gfoCandidateSkillsTable.skillId,
      name: gfoSkillsLibraryTable.name,
    })
    .from(gfoCandidateSkillsTable)
    .innerJoin(
      gfoSkillsLibraryTable,
      eq(gfoCandidateSkillsTable.skillId, gfoSkillsLibraryTable.id)
    )
    .where(eq(gfoCandidateSkillsTable.candidateUserId, userId));

  const progressRows = await db
    .select()
    .from(gfoCandidateInterviewProgressTable)
    .where(eq(gfoCandidateInterviewProgressTable.candidateUserId, userId));

  const hiddenRows = await db
    .select({
      organisationId: gfoCandidateHiddenOrganisationsTable.organisationId,
    })
    .from(gfoCandidateHiddenOrganisationsTable)
    .where(eq(gfoCandidateHiddenOrganisationsTable.candidateUserId, userId));

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
    skills: skillRows.map((r) => r.name),
    hiddenOrganisationIds: hiddenRows.map((r) => r.organisationId),
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

  return successResponse(summary);
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    const form = await req.formData();

    let rawProfile: unknown;
    try {
      rawProfile = JSON.parse(form.get("profile")?.toString() || "{}");
    } catch {
      return ApiErrors.badRequest("profile must be valid JSON");
    }
    const parsed = candidateProfileSchema.safeParse(rawProfile);
    if (!parsed.success) {
      return ApiErrors.validationError(zodFieldErrors(parsed.error));
    }
    const { professionalTitle, currentRole, yearsExperience, location, bio, skillIds, interviewProgress } = parsed.data;

    const resumeFile = form.get("resume");
    if (!(resumeFile instanceof File)) {
      return ApiErrors.badRequest("Resume file is required");
    }

    const fileValidation = await validateFile(resumeFile);
    if (!fileValidation.valid) {
      return ApiErrors.badRequest(fileValidation.error || "Invalid file");
    }

    // Resolve skills against the library up front so bad ids fail with a 422
    // instead of an FK violation after the resume was already stored.
    let resolvedSkillIds: string[] = [];
    if (skillIds.length > 0) {
      const rows = await db
        .select({ id: gfoSkillsLibraryTable.id })
        .from(gfoSkillsLibraryTable)
        .where(inArray(gfoSkillsLibraryTable.id, skillIds));
      resolvedSkillIds = rows.map((r) => r.id);
    }

    const resumeUrl = await handleResumeUpload(userId, resumeFile, bio);

    await db
      .insert(gfoCandidatesTable)
      .values({
        userId,
        professionalTitle,
        currentRole,
        yearsExperience,
        location,
        bio,
        resumeUrl,
      })
      .onConflictDoUpdate({
        target: gfoCandidatesTable.userId,
        set: {
          professionalTitle,
          currentRole,
          yearsExperience,
          location,
          bio,
          resumeUrl,
          updatedAt: new Date(),
        },
      });

    await db
      .delete(gfoCandidateSkillsTable)
      .where(eq(gfoCandidateSkillsTable.candidateUserId, userId));

    if (resolvedSkillIds.length > 0) {
      await db.insert(gfoCandidateSkillsTable).values(
        resolvedSkillIds.map((id) => ({
          candidateUserId: userId,
          skillId: id,
        }))
      );
    }

    if (interviewProgress.length) {
      await db.insert(gfoCandidateInterviewProgressTable).values(
        interviewProgress.map((e) => ({
          id: e.id,
          candidateUserId: userId,
          companyId: e.companyId,
          position: e.position,
          roundsCleared: e.roundsCleared,
          totalRounds: e.totalRounds,
          status: e.status,
          verificationStatus: "unverified",
          dateCleared: new Date(e.dateCleared),
        }))
      );
    }
    queueProfileSync(userId).catch(console.error);
    queueGraphSync({ userId, reason: "candidate_profile_update" }).catch(console.error);

    return successResponse(undefined, "Profile created. Resume processing in background.");
  } catch (err) {
    console.error("POST Error:", err);
    return ApiErrors.serverError("Failed to create profile");
  }
}

export async function PATCH(req: NextRequest) {
  let userId: string;
  try {
    userId = await getCurrentUserId();
  } catch {
    return ApiErrors.unauthorized();
  }

  const contentType = req.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    try {
      const form = await req.formData();
      const resumeFile = form.get("resume") as File;
      if (!resumeFile) {
        return ApiErrors.badRequest("Resume file is required");
      }

      const fileValidation = await validateFile(resumeFile);
      if (!fileValidation.valid) {
        return ApiErrors.badRequest(fileValidation.error || "Invalid file");
      }

      const [existing] = await db
        .select({ bio: gfoCandidatesTable.bio })
        .from(gfoCandidatesTable)
        .where(eq(gfoCandidatesTable.userId, userId));

      const resumeUrl = await handleResumeUpload(
        userId,
        resumeFile,
        existing?.bio || ""
      );

      await db
        .update(gfoCandidatesTable)
        .set({ resumeUrl })
        .where(eq(gfoCandidatesTable.userId, userId));
      queueGraphSync({ userId, reason: "candidate_profile_update" }).catch(console.error);
      return successResponse({ resumeUrl }, "Resume uploaded successfully");
    } catch {
      return ApiErrors.serverError("Failed to upload resume");
    }
  } else {
    const body = (await req.json()) as { action?: string; progress?: unknown };
    if (body.action !== "progress") {
      return ApiErrors.badRequest("Unknown action");
    }

    const progressResult = z
      .array(interviewProgressEntrySchema)
      .max(100)
      .safeParse(body.progress);
    if (!progressResult.success) {
      return ApiErrors.validationError(zodFieldErrors(progressResult.error));
    }
    const incoming = progressResult.data;

    const existingRows = await db
      .select()
      .from(gfoCandidateInterviewProgressTable)
      .where(eq(gfoCandidateInterviewProgressTable.candidateUserId, userId));
    const existingById = new Map(existingRows.map((r) => [r.id, r]));
    const existingIds = existingRows.map((r) => r.id);

    const incomingIds = incoming.map((e) => e.id);

    const toDelete = existingIds.filter((id) => !incomingIds.includes(id));
    if (toDelete.length > 0) {
      // Find verification requests being orphaned
      const orphanedRequests = await db
        .select({ id: gfoVerificationRequestsTable.id })
        .from(gfoVerificationRequestsTable)
        .where(
          and(
            eq(gfoVerificationRequestsTable.scope, "candidate_interview"),
            inArray(gfoVerificationRequestsTable.targetId, toDelete)
          )
        );

      if (orphanedRequests.length > 0) {
        const orphanedRequestIds = orphanedRequests.map((r) => r.id);

        // Fetch storage paths for Supabase cleanup
        const orphanedDocs = await db
          .select({ storagePath: gfoVerificationDocumentsTable.storagePath })
          .from(gfoVerificationDocumentsTable)
          .where(inArray(gfoVerificationDocumentsTable.verificationRequestId, orphanedRequestIds));

        // Remove files from Supabase (best-effort)
        if (orphanedDocs.length > 0) {
          await removeVerificationDocs(orphanedDocs.map((d) => d.storagePath));
        }

        // Delete DB rows (documents cascade via FK)
        await db
          .delete(gfoVerificationRequestsTable)
          .where(inArray(gfoVerificationRequestsTable.id, orphanedRequestIds));
      }
      await db
        .delete(gfoCandidateInterviewProgressTable)
        .where(inArray(gfoCandidateInterviewProgressTable.id, toDelete));
    }

    for (const e of incoming) {
      const existing = existingById.get(e.id);
      // Editing a verified entry invalidates the verification only when a
      // substantive claim actually changed.
      const isUnchanged = existing &&
        existing.companyId === e.companyId &&
        existing.position === e.position &&
        existing.roundsCleared === e.roundsCleared &&
        existing.totalRounds === e.totalRounds &&
        existing.status === e.status &&
        existing.dateCleared.getTime() === new Date(e.dateCleared).getTime();

      if (existing) {
        await db
          .update(gfoCandidateInterviewProgressTable)
          .set({
            companyId: e.companyId,
            position: e.position,
            roundsCleared: e.roundsCleared,
            totalRounds: e.totalRounds,
            status: e.status,
            ...(isUnchanged ? {} : {
              verificationStatus: "unverified",
              verificationRequestedAt: null,
            }),
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
          verificationStatus: "unverified",
          dateCleared: new Date(e.dateCleared),
        });
      }
    }

    queueProfileSync(userId).catch(console.error);
    queueGraphSync({ userId, reason: "candidate_profile_update" }).catch(console.error);

    return successResponse(undefined, "Progress updated");
  }
}

export async function PUT(req: NextRequest) {
  let userId: string;
  try {
    userId = await getCurrentUserId();
  } catch {
    return ApiErrors.unauthorized();
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return ApiErrors.badRequest("Request body must be JSON");
  }

  const parsed = candidateProfileUpdateSchema.omit({ resumeUrl: true }).safeParse(body);
  if (!parsed.success) {
    return ApiErrors.validationError(zodFieldErrors(parsed.error));
  }
  const { professionalTitle, currentRole, yearsExperience, location, bio, skillIds } = parsed.data;

  let resolvedSkillIds: string[] = [];
  if (skillIds.length > 0) {
    const rows = await db
      .select({ id: gfoSkillsLibraryTable.id })
      .from(gfoSkillsLibraryTable)
      .where(inArray(gfoSkillsLibraryTable.id, skillIds));
    resolvedSkillIds = rows.map((r) => r.id);
  }

  // resumeUrl is intentionally never written here: it is managed by the
  // upload path and must not be overridable from the client.
  await db
    .insert(gfoCandidatesTable)
    .values({
      userId,
      professionalTitle,
      currentRole,
      yearsExperience,
      location,
      bio,
      resumeUrl: "",
      verificationStatus: "unverified",
    })
    .onConflictDoUpdate({
      target: gfoCandidatesTable.userId,
      set: {
        professionalTitle,
        currentRole,
        yearsExperience,
        location,
        bio,
        updatedAt: new Date(),
      },
    });

  await db
    .delete(gfoCandidateSkillsTable)
    .where(eq(gfoCandidateSkillsTable.candidateUserId, userId));

  if (resolvedSkillIds.length > 0) {
    await db.insert(gfoCandidateSkillsTable).values(
      resolvedSkillIds.map((sid) => ({
        candidateUserId: userId,
        skillId: sid,
      }))
    );
  }

  queueProfileSync(userId).catch(console.error);
  queueGraphSync({ userId, reason: "candidate_profile_update" }).catch(console.error);

  return successResponse(undefined, "Profile updated");
}
