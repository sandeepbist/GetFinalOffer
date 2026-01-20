import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { eq, and } from "drizzle-orm";
import db from "@/db";
import { getCurrentUserId } from "@/lib/auth/current-user";
import { gfoContactsTable } from "@/db/schemas";

export async function POST(req: NextRequest) {
  let recruiterId: string;
  try {
    recruiterId = await getCurrentUserId();
  } catch {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { candidateUserId } = (await req.json()) as {
    candidateUserId: string;
  };
  if (!candidateUserId) {
    return NextResponse.json(
      { success: false, error: "Missing candidateUserId" },
      { status: 400 }
    );
  }

  const [existing] = await db
    .select({ id: gfoContactsTable.id })
    .from(gfoContactsTable)
    .where(
      and(
        eq(gfoContactsTable.recruiterUserId, recruiterId),
        eq(gfoContactsTable.candidateUserId, candidateUserId),
        eq(gfoContactsTable.contacter, "recruiter")
      )
    )
    .limit(1);

  if (existing) {
    return NextResponse.json(
      { success: true, alreadyInvited: true },
      { status: 200 }
    );
  }

  await db.insert(gfoContactsTable).values({
    id: randomUUID(),
    recruiterUserId: recruiterId,
    candidateUserId,
    contacter: "recruiter",
  });

  return NextResponse.json(
    { success: true, alreadyInvited: false },
    { status: 200 }
  );
}
