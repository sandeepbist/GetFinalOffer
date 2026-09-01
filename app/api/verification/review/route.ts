import { NextRequest } from "next/server";
import { desc, eq, inArray } from "drizzle-orm";
import { z } from "zod";
import db from "@/db";
import {
  gfoUserTable,
  gfoCandidatesTable,
  gfoCandidateInterviewProgressTable,
  gfoVerificationRequestsTable,
  gfoVerificationDocumentsTable,
} from "@/db/schemas";
import { getCurrentUser } from "@/lib/auth/current-user";
import { isAdminEmail } from "@/lib/auth/admin";
import { getVerificationSignedUrl } from "@/lib/verification-storage";
import { ApiErrors, successResponse } from "@/features/common/api/response";
import { zodFieldErrors } from "@/features/common/api/validation";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!isAdminEmail(user.email)) {
      return ApiErrors.forbidden("Admin access required");
    }

    const requests = await db
      .select({
        id: gfoVerificationRequestsTable.id,
        scope: gfoVerificationRequestsTable.scope,
        targetId: gfoVerificationRequestsTable.targetId,
        requestedByUserId: gfoVerificationRequestsTable.requestedByUserId,
        requesterName: gfoUserTable.name,
        requesterEmail: gfoUserTable.email,
        subject: gfoVerificationRequestsTable.subject,
        notes: gfoVerificationRequestsTable.notes,
        status: gfoVerificationRequestsTable.status,
        requestedAt: gfoVerificationRequestsTable.requestedAt,
      })
      .from(gfoVerificationRequestsTable)
      .innerJoin(
        gfoUserTable,
        eq(gfoUserTable.id, gfoVerificationRequestsTable.requestedByUserId)
      )
      .orderBy(desc(gfoVerificationRequestsTable.requestedAt))
      .limit(100);

    if (requests.length === 0) {
      return successResponse({ requests: [] });
    }

    const requestIds = requests.map((r) => r.id);
    const docRows = await db
      .select({
        requestId: gfoVerificationDocumentsTable.verificationRequestId,
        storagePath: gfoVerificationDocumentsTable.storagePath,
        originalFileName: gfoVerificationDocumentsTable.originalFileName,
        mimeType: gfoVerificationDocumentsTable.mimeType,
        sizeBytes: gfoVerificationDocumentsTable.sizeBytes,
      })
      .from(gfoVerificationDocumentsTable)
      .where(inArray(gfoVerificationDocumentsTable.verificationRequestId, requestIds));

    // Signed URLs are minted per response so each admin session gets a fresh
    // short-lived link; documents never leave the private bucket otherwise.
    const docsWithUrls = await Promise.all(
      docRows.map(async (doc) => {
        let signedUrl: string | null = null;
        try {
          signedUrl = await getVerificationSignedUrl(doc.storagePath);
        } catch (err) {
          console.warn("Failed to sign verification document URL", err);
        }
        return { ...doc, signedUrl };
      })
    );

    const docsByRequest = new Map<string, typeof docsWithUrls>();
    for (const doc of docsWithUrls) {
      const list = docsByRequest.get(doc.requestId) ?? [];
      list.push(doc);
      docsByRequest.set(doc.requestId, list);
    }

    return successResponse({
      requests: requests.map((r) => ({
        ...r,
        requestedAt: r.requestedAt.toISOString(),
        documents: docsByRequest.get(r.id) ?? [],
      })),
    });
  } catch (err) {
    if (err instanceof Error && err.message.includes("Unauthorized")) {
      return ApiErrors.unauthorized();
    }
    console.error("Verification review list failed:", err);
    return ApiErrors.serverError();
  }
}

const reviewDecisionSchema = z.object({
  requestId: z.string().min(1),
  decision: z.enum(["approved", "rejected"]),
  decisionNote: z.string().max(2000).optional().default(""),
});

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!isAdminEmail(user.email)) {
      return ApiErrors.forbidden("Admin access required");
    }

    const body: unknown = await req.json();
    const parsed = reviewDecisionSchema.safeParse(body);
    if (!parsed.success) {
      return ApiErrors.validationError(zodFieldErrors(parsed.error));
    }
    const { requestId, decision, decisionNote } = parsed.data;

    const [request] = await db
      .select()
      .from(gfoVerificationRequestsTable)
      .where(eq(gfoVerificationRequestsTable.id, requestId));

    if (!request) {
      return ApiErrors.notFound("Verification request");
    }
    if (request.status !== "pending") {
      return ApiErrors.badRequest(`Request was already ${request.status}`);
    }

    await db.transaction(async (tx) => {
      await tx
        .update(gfoVerificationRequestsTable)
        .set({
          status: decision,
          decisionNote,
          reviewedAt: new Date(),
          reviewedByUserId: user.id,
          updatedAt: new Date(),
        })
        .where(eq(gfoVerificationRequestsTable.id, requestId));

      if (decision !== "approved") {
        // A rejection marks the target unverified; the requester sees the
        // status and can re-submit with better documents.
        if (request.scope === "candidate_profile") {
          await tx
            .update(gfoCandidatesTable)
            .set({ verificationStatus: "rejected", updatedAt: new Date() })
            .where(eq(gfoCandidatesTable.userId, request.targetId));
        } else if (request.scope === "candidate_interview") {
          await tx
            .update(gfoCandidateInterviewProgressTable)
            .set({ verificationStatus: "rejected", updatedAt: new Date() })
            .where(eq(gfoCandidateInterviewProgressTable.id, request.targetId));
        }
        return;
      }

      if (request.scope === "candidate_profile") {
        await tx
          .update(gfoCandidatesTable)
          .set({
            verificationStatus: "verified",
            verifiedBoost: true,
            updatedAt: new Date(),
          })
          .where(eq(gfoCandidatesTable.userId, request.targetId));
      } else if (request.scope === "candidate_interview") {
        await tx
          .update(gfoCandidateInterviewProgressTable)
          .set({ verificationStatus: "verified", updatedAt: new Date() })
          .where(eq(gfoCandidateInterviewProgressTable.id, request.targetId));
      }
    });

    return successResponse(undefined, `Request ${decision}`);
  } catch (err) {
    if (err instanceof Error && err.message.includes("Unauthorized")) {
      return ApiErrors.unauthorized();
    }
    console.error("Verification review decision failed:", err);
    return ApiErrors.serverError();
  }
}
