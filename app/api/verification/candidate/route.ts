import type { NextRequest } from "next/server";
import fs from "fs";
import path from "path";
import { eq } from "drizzle-orm";
import db from "@/db";
import {
  gfoCandidatesTable,
  gfoCandidateInterviewProgressTable,
  gfoInterviewDocumentsTable,
} from "@/db/schemas";
import { getCurrentUserId } from "@/lib/auth/current-user";
import { ApiErrors, successResponse } from "@/features/common/api/response";
import { validateFiles } from "@/features/common/api/file-validation";
import { uploadLimiter } from "@/lib/limiter";

export const config = {
  api: { bodyParser: false },
};

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

  if (action === "profile") {
    await db
      .update(gfoCandidatesTable)
      .set({
        verificationStatus: "pending",
        verificationRequestedAt: new Date(),
      })
      .where(eq(gfoCandidatesTable.userId, userId));

    return successResponse(undefined, "Profile verification requested");
  }

  const progId = form.get("interviewProgressId")?.toString();
  if (!progId) {
    return ApiErrors.badRequest("Missing interviewProgressId");
  }

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(progId)) {
    return ApiErrors.badRequest("Invalid interviewProgressId format");
  }

  const files: File[] = [];
  form.forEach((value, key) => {
    if (key === "files" && value instanceof File) {
      files.push(value);
    }
  });

  if (files.length > 0) {
    const validationResult = await validateFiles(files);
    if (!validationResult.valid) {
      return ApiErrors.badRequest(validationResult.error || "Invalid file");
    }
  }

  await db
    .update(gfoCandidateInterviewProgressTable)
    .set({ verificationStatus: "pending", verificationRequestedAt: new Date() })
    .where(eq(gfoCandidateInterviewProgressTable.id, progId));

  const subject = form.get("subject")?.toString()?.slice(0, 200) || "";
  const note = form.get("notes")?.toString()?.slice(0, 2000) || "";
  const uploadsDir = path.join(
    process.cwd(),
    "public",
    "uploads",
    "verifications",
    "candidate",
    "interview",
    String(progId)
  );

  if (files.length > 0) {
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const filename = `${Date.now()}-${sanitizedName}`;
      const filePath = path.join(uploadsDir, filename);
      await fs.promises.writeFile(filePath, buffer);
      const url = `/uploads/verifications/candidate/interview/${progId}/${filename}`;

      await db.insert(gfoInterviewDocumentsTable).values({
        interviewProgressId: progId,
        documentUrl: url,
        subject,
        note,
      });
    }
  }

  return successResponse(undefined, "Interview verification requested");
}