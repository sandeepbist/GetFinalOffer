import type { NextRequest } from "next/server";
import { eq, and } from "drizzle-orm";
import db from "@/db";
import {
  gfoCandidatesTable,
  gfoCandidateInterviewProgressTable,
  gfoVerificationRequestsTable,
  gfoVerificationDocumentsTable,
} from "@/db/schemas";
import { getCurrentUserId } from "@/lib/auth/current-user";
import { ApiErrors, successResponse } from "@/features/common/api/response";
import { validateFiles } from "@/features/common/api/file-validation";
import { uploadLimiter } from "@/lib/limiter";
import {
  uploadVerificationDoc,
  removeVerificationDocs,
  type UploadedDocMeta,
} from "@/lib/verification-storage";

export const config = {
  api: { bodyParser: false },
};

/**
 * Upload files sequentially, tracking successes so we can clean up on partial failure.
 * If any upload fails, previously successful uploads are removed best-effort.
 */
async function uploadFilesWithRollback(
  prefix: string,
  files: File[]
): Promise<UploadedDocMeta[]> {
  const uploaded: UploadedDocMeta[] = [];
  try {
    for (const file of files) {
      const meta = await uploadVerificationDoc(prefix, file);
      uploaded.push(meta);
    }
    return uploaded;
  } catch (err) {
    // Clean up any files that were already uploaded
    if (uploaded.length > 0) {
      await removeVerificationDocs(uploaded.map((u) => u.storagePath));
    }
    throw err;
  }
}

export async function POST(req: NextRequest) {
  if (!req.headers.get("content-type")?.startsWith("multipart/form-data")) {
    return ApiErrors.badRequest("Invalid content type");
  }

  let userId: string;
  try {
    userId = await getCurrentUserId();
  } catch {
    return ApiErrors.unauthorized();
  }

  const { success, limit, reset, remaining } = await uploadLimiter.limit(userId);
  if (!success) {
    return ApiErrors.rateLimited(limit, remaining, reset);
  }

  const form = await req.formData();
  const action = form.get("action")?.toString();

  if (!action || (action !== "profile" && action !== "interview")) {
    return ApiErrors.badRequest("Invalid action. Must be 'profile' or 'interview'");
  }

  // ── Extract files from form ────────────────────────────────────────
  const files: File[] = [];
  form.forEach((value, key) => {
    if (key === "files" && value instanceof File) {
      files.push(value);
    }
  });

  if (files.length === 0) {
    return ApiErrors.badRequest("At least one proof document is required");
  }

  const validationResult = await validateFiles(files);
  if (!validationResult.valid) {
    return ApiErrors.badRequest(validationResult.error || "Invalid file");
  }

  const subject = form.get("subject")?.toString()?.slice(0, 200) || "";
  const notes = form.get("notes")?.toString()?.slice(0, 2000) || "";

  // ── Profile verification ───────────────────────────────────────────
  if (action === "profile") {
    if (!subject.trim()) {
      return ApiErrors.badRequest("Subject is required");
    }

    // Verify the user actually has a candidate row
    const [candidate] = await db
      .select({ userId: gfoCandidatesTable.userId })
      .from(gfoCandidatesTable)
      .where(eq(gfoCandidatesTable.userId, userId));

    if (!candidate) {
      return ApiErrors.badRequest("No candidate profile found. Create your profile first.");
    }

    // Upload files sequentially with rollback on partial failure
    let uploaded: UploadedDocMeta[];
    try {
      uploaded = await uploadFilesWithRollback(`profile/${userId}`, files);
    } catch (err) {
      return ApiErrors.serverError(
        err instanceof Error ? err.message : "File upload failed"
      );
    }

    // DB operations in a single transaction
    try {
      await db.transaction(async (tx) => {
        const [request] = await tx
          .insert(gfoVerificationRequestsTable)
          .values({
            scope: "candidate_profile",
            targetId: userId,
            requestedByUserId: userId,
            subject,
            notes: notes || null,
          })
          .returning({ id: gfoVerificationRequestsTable.id });

        await tx.insert(gfoVerificationDocumentsTable).values(
          uploaded.map((u) => ({
            verificationRequestId: request.id,
            storagePath: u.storagePath,
            originalFileName: u.originalFileName,
            mimeType: u.mimeType,
            sizeBytes: u.sizeBytes,
          }))
        );

        await tx
          .update(gfoCandidatesTable)
          .set({
            verificationStatus: "pending",
            verificationRequestedAt: new Date(),
          })
          .where(eq(gfoCandidatesTable.userId, userId));
      });
    } catch {
      // Best-effort cleanup of uploaded files
      await removeVerificationDocs(uploaded.map((u) => u.storagePath));
      return ApiErrors.serverError("Failed to save verification request");
    }

    return successResponse(undefined, "Profile verification requested");
  }

  // ── Interview verification ─────────────────────────────────────────
  if (!subject.trim()) {
    return ApiErrors.badRequest("Subject is required");
  }

  const progId = form.get("interviewProgressId")?.toString();
  if (!progId) {
    return ApiErrors.badRequest("Missing interviewProgressId");
  }

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(progId)) {
    return ApiErrors.badRequest("Invalid interviewProgressId format");
  }

  // Ownership check — verify the interview progress belongs to this user
  const [owned] = await db
    .select({ id: gfoCandidateInterviewProgressTable.id })
    .from(gfoCandidateInterviewProgressTable)
    .where(
      and(
        eq(gfoCandidateInterviewProgressTable.id, progId),
        eq(gfoCandidateInterviewProgressTable.candidateUserId, userId)
      )
    );

  if (!owned) {
    return ApiErrors.forbidden("Interview record not found or access denied");
  }

  // Upload files sequentially with rollback on partial failure
  let uploaded: UploadedDocMeta[];
  try {
    uploaded = await uploadFilesWithRollback(`interview/${progId}`, files);
  } catch (err) {
    return ApiErrors.serverError(
      err instanceof Error ? err.message : "File upload failed"
    );
  }

  // DB operations in a single transaction
  try {
    await db.transaction(async (tx) => {
      const [request] = await tx
        .insert(gfoVerificationRequestsTable)
        .values({
          scope: "candidate_interview",
          targetId: progId,
          requestedByUserId: userId,
          subject,
          notes: notes || null,
        })
        .returning({ id: gfoVerificationRequestsTable.id });

      await tx.insert(gfoVerificationDocumentsTable).values(
        uploaded.map((u) => ({
          verificationRequestId: request.id,
          storagePath: u.storagePath,
          originalFileName: u.originalFileName,
          mimeType: u.mimeType,
          sizeBytes: u.sizeBytes,
        }))
      );

      await tx
        .update(gfoCandidateInterviewProgressTable)
        .set({ verificationStatus: "pending", verificationRequestedAt: new Date() })
        .where(eq(gfoCandidateInterviewProgressTable.id, progId));
    });
  } catch {
    // Best-effort cleanup of uploaded files
    await removeVerificationDocs(uploaded.map((u) => u.storagePath));
    return ApiErrors.serverError("Failed to save verification request");
  }

  return successResponse(undefined, "Interview verification requested");
}