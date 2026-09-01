import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import db from "@/db";
import { gfoRecruitersTable, gfoPartnerOrganisationsTable } from "@/db/schemas";
import { getCurrentUser } from "@/lib/auth/current-user";
import { ApiErrors, successResponse } from "@/features/common/api/response";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (user.role !== "recruiter") {
      return ApiErrors.forbidden("Recruiter accounts can only be created during recruiter signup");
    }

    const { organisationId } = (await req.json()) as {
      organisationId: string;
    };

    if (!organisationId || typeof organisationId !== "string") {
      return NextResponse.json(
        { success: false, error: "Missing organisationId" },
        { status: 400 },
      );
    }

    const [organisation] = await db
      .select({ id: gfoPartnerOrganisationsTable.id, domain: gfoPartnerOrganisationsTable.domain })
      .from(gfoPartnerOrganisationsTable)
      .where(eq(gfoPartnerOrganisationsTable.id, organisationId));

    if (!organisation) {
      return ApiErrors.notFound("Organisation");
    }

    const emailDomain = user.email.split("@")[1]?.toLowerCase().trim();
    if (!emailDomain || emailDomain !== organisation.domain.toLowerCase().trim()) {
      return ApiErrors.forbidden("Work email domain does not match the selected organisation");
    }

    await db
      .insert(gfoRecruitersTable)
      .values({
        userId: user.id,
        organisationId,
      })
      .onConflictDoNothing({ target: gfoRecruitersTable.userId });

    return successResponse();
  } catch (err) {
    if (err instanceof Error && err.message.includes("Unauthorized")) {
      return ApiErrors.unauthorized();
    }
    console.error("Error creating recruiter:", err);
    return ApiErrors.serverError();
  }
}
