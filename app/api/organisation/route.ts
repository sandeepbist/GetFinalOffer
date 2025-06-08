import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import db from "@/db";
import {
  gfoPartnerOrganisationsTable,
  gfoCandidateHiddenOrganisationsTable,
  gfoCandidatesTable,
} from "@/db/schemas";
import { betterFetch } from "@better-fetch/fetch";

async function getUserId(req: NextRequest): Promise<string> {
  const { data: session } = await betterFetch<{ user: { id: string } }>(
    "/api/auth/get-session",
    {
      baseURL: req.nextUrl.origin,
      headers: { cookie: req.headers.get("cookie") || "" },
    }
  );
  if (!session?.user?.id) throw new Error("Not authenticated");
  return session.user.id;
}

export async function GET(req: NextRequest) {
  const organisations = await db
    .select()
    .from(gfoPartnerOrganisationsTable)
    .orderBy(gfoPartnerOrganisationsTable.name);
  return NextResponse.json(organisations);
}

export async function POST(req: NextRequest) {
  let userId: string;
  try {
    userId = await getUserId(req);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [cand] = await db
    .select()
    .from(gfoCandidatesTable)
    .where(eq(gfoCandidatesTable.userId, userId));
  if (!cand) {
    return NextResponse.json(
      { error: "Create your candidate profile before hiding organisations" },
      { status: 400 }
    );
  }

  const { hiddenOrganisationIds } = (await req.json()) as {
    hiddenOrganisationIds: string[];
  };

  await db
    .delete(gfoCandidateHiddenOrganisationsTable)
    .where(eq(gfoCandidateHiddenOrganisationsTable.candidateUserId, userId));

  if (hiddenOrganisationIds.length > 0) {
    await db.insert(gfoCandidateHiddenOrganisationsTable).values(
      hiddenOrganisationIds.map((orgId) => ({
        id: randomUUID(),
        candidateUserId: userId,
        organisationId: orgId,
      }))
    );
  }

  return NextResponse.json({ success: true });
}
