import { NextRequest, NextResponse } from "next/server";
import { eq, inArray } from "drizzle-orm";
import db from "@/db";
import {
  gfoPartnerOrganisationsTable,
  gfoCandidateHiddenOrganisationsTable,
  gfoCandidatesTable,
} from "@/db/schemas";
import { getCurrentUserId } from "@/lib/auth/current-user";
import { ApiErrors, successResponse } from "@/features/common/api/response";

/**
 * Public directory of partner organisations. Only the display fields are
 * exposed; the signup domain is verified server-side in POST /api/recruiter,
 * so clients never need it here and it must not be enumerable.
 */
export async function GET() {
  const organisations = await db
    .select({
      id: gfoPartnerOrganisationsTable.id,
      name: gfoPartnerOrganisationsTable.name,
      description: gfoPartnerOrganisationsTable.description,
      teamSize: gfoPartnerOrganisationsTable.teamSize,
      website: gfoPartnerOrganisationsTable.website,
    })
    .from(gfoPartnerOrganisationsTable)
    .orderBy(gfoPartnerOrganisationsTable.name);
  return NextResponse.json(organisations);
}

export async function POST(req: NextRequest) {
  let userId: string;
  try {
    userId = await getCurrentUserId();
  } catch {
    return ApiErrors.unauthorized();
  }

  const [cand] = await db
    .select()
    .from(gfoCandidatesTable)
    .where(eq(gfoCandidatesTable.userId, userId));
  if (!cand) {
    return ApiErrors.badRequest("Create your candidate profile before hiding organisations");
  }

  const body = (await req.json()) as { hiddenOrganisationIds?: unknown };
  const rawIds = Array.isArray(body.hiddenOrganisationIds) ? body.hiddenOrganisationIds : null;
  if (!rawIds || rawIds.some((id) => typeof id !== "string")) {
    return ApiErrors.badRequest("hiddenOrganisationIds must be an array of organisation IDs");
  }
  const hiddenOrganisationIds = Array.from(new Set(rawIds as string[]));

  // Only ids of real partner organisations can be hidden; anything else would
  // violate the foreign key at insert time and surface as a 500.
  let existingIds: string[] = [];
  if (hiddenOrganisationIds.length > 0) {
    const rows = await db
      .select({ id: gfoPartnerOrganisationsTable.id })
      .from(gfoPartnerOrganisationsTable)
      .where(inArray(gfoPartnerOrganisationsTable.id, hiddenOrganisationIds));
    existingIds = rows.map((r) => r.id);
  }

  await db
    .delete(gfoCandidateHiddenOrganisationsTable)
    .where(eq(gfoCandidateHiddenOrganisationsTable.candidateUserId, userId));

  if (existingIds.length > 0) {
    await db.insert(gfoCandidateHiddenOrganisationsTable).values(
      existingIds.map((orgId) => ({
        candidateUserId: userId,
        organisationId: orgId,
      })),
    );
  }

  return successResponse();
}
