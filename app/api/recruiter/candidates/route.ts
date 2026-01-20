import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { gfoRecruitersTable } from "@/db/schemas";
import { eq } from "drizzle-orm";
import { searchLimiter } from "@/lib/limiter";
import { searchCandidatesHybrid } from "@/features/recruiter/candidates-data-access";
import { getCurrentUserId } from "@/lib/auth/current-user";

export const dynamic = "force-dynamic";


export async function GET(req: NextRequest) {
  let userId: string;
  try {
    userId = await getCurrentUserId();
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const { success, limit, reset, remaining } = await searchLimiter.limit(userId);
  if (!success) {
    return NextResponse.json(
      { error: "Too many searches. Please wait a moment." },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString()
        }
      }
    );
  }

  try {
    const [recruiter] = await db
      .select({ organisationId: gfoRecruitersTable.organisationId })
      .from(gfoRecruitersTable)
      .where(eq(gfoRecruitersTable.userId, userId));

    if (!recruiter) {
      return NextResponse.json({ message: "Not a recruiter" }, { status: 403 });
    }

    const qp = req.nextUrl.searchParams;
    const search = qp.get("search") || "";
    const minYears = qp.get("minYears") ? parseInt(qp.get("minYears")!) : 0;
    const page = parseInt(qp.get("page") || "1");
    const pageSize = parseInt(qp.get("pageSize") || "10");

    const result = await searchCandidatesHybrid(
      search,
      page,
      pageSize,
      { minYears, recruiterOrgId: recruiter.organisationId }
    );

    return NextResponse.json(result);

  } catch (err) {
    console.error("Search Error:", err);
    return NextResponse.json(
      { message: "Search service unavailable", error: err instanceof Error ? err.message : "Unknown" },
      { status: 500 }
    );
  }
}