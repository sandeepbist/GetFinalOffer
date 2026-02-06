import { NextRequest } from "next/server";
import db from "@/db";
import { gfoRecruitersTable } from "@/db/schemas";
import { eq } from "drizzle-orm";
import { searchLimiter } from "@/lib/limiter";
import { searchCandidatesHybrid } from "@/features/recruiter/candidates-data-access";
import { getCurrentUserId } from "@/lib/auth/current-user";
import { ApiErrors, successResponse } from "@/features/common/api/response";
import { candidateSearchSchema, parseSearchParams } from "@/features/common/api/validation";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  let userId: string;
  try {
    userId = await getCurrentUserId();
  } catch {
    return ApiErrors.unauthorized();
  }

  const { success, limit, reset, remaining } = await searchLimiter.limit(userId);
  if (!success) {
    return ApiErrors.rateLimited(limit, remaining, reset);
  }

  try {
    const parsed = parseSearchParams(req.nextUrl.searchParams, candidateSearchSchema);

    if ("error" in parsed) {
      const errors = parsed.error.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      return ApiErrors.validationError(errors);
    }

    const { search, minYears, page, pageSize } = parsed;

    const [recruiter] = await db
      .select({ organisationId: gfoRecruitersTable.organisationId })
      .from(gfoRecruitersTable)
      .where(eq(gfoRecruitersTable.userId, userId));

    if (!recruiter) {
      return ApiErrors.forbidden("Recruiter access required");
    }

    const result = await searchCandidatesHybrid(search, page, pageSize, {
      minYears,
      recruiterOrgId: recruiter.organisationId,
    });

    return successResponse(result);

  } catch (err) {
    console.error("Search Error:", err);
    return ApiErrors.serverError("Search service temporarily unavailable");
  }
}