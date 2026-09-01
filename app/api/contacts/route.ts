import { NextRequest, NextResponse } from "next/server";
import { eq, and, desc } from "drizzle-orm";
import db from "@/db";
import { getCurrentUser } from "@/lib/auth/current-user";
import {
  gfoContactsTable,
  gfoContactDetailsTable,
  gfoRecruitersTable,
} from "@/features/recruiter/recruiter-schemas";
import {
  gfoCandidatesTable,
  gfoCandidateHiddenOrganisationsTable,
} from "@/features/candidate/candidate-schemas";

export async function POST(req: NextRequest) {
  let user;
  try {
    user = await getCurrentUser();
  } catch {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  if (user.role !== "recruiter") {
    return NextResponse.json(
      { success: false, error: "Only recruiters can send invites" },
      { status: 403 }
    );
  }

  // The role string alone is not authority: a real recruiter row for this
  // user is required (it carries the organisation the stealth check uses).
  const [recruiter] = await db
    .select({ organisationId: gfoRecruitersTable.organisationId })
    .from(gfoRecruitersTable)
    .where(eq(gfoRecruitersTable.userId, user.id));

  if (!recruiter) {
    return NextResponse.json(
      { success: false, error: "Only recruiters can send invites" },
      { status: 403 }
    );
  }

  const { candidateUserId } = (await req.json()) as { candidateUserId: string };
  if (!candidateUserId || typeof candidateUserId !== "string") {
    return NextResponse.json({ success: false, error: "Missing candidateUserId" }, { status: 400 });
  }

  const [candidate] = await db
    .select({ userId: gfoCandidatesTable.userId })
    .from(gfoCandidatesTable)
    .where(eq(gfoCandidatesTable.userId, candidateUserId))
    .limit(1);

  if (!candidate) {
    return NextResponse.json({ success: false, error: "Candidate not found" }, { status: 404 });
  }

  // Stealth setting enforcement: a candidate who hid the recruiter's
  // organisation must be unreachable here too, not just in search. Return
  // the same 404 so the API cannot be used to confirm they exist.
  {
    const [hidden] = await db
      .select({ id: gfoCandidateHiddenOrganisationsTable.id })
      .from(gfoCandidateHiddenOrganisationsTable)
      .where(
        and(
          eq(gfoCandidateHiddenOrganisationsTable.candidateUserId, candidateUserId),
          eq(
            gfoCandidateHiddenOrganisationsTable.organisationId,
            recruiter.organisationId
          )
        )
      );
    if (hidden) {
      return NextResponse.json({ success: false, error: "Candidate not found" }, { status: 404 });
    }
  }

  const [existing] = await db
    .select({ id: gfoContactsTable.id })
    .from(gfoContactsTable)
    .where(
      and(
        eq(gfoContactsTable.recruiterUserId, user.id),
        eq(gfoContactsTable.candidateUserId, candidateUserId)
      )
    )
    .limit(1);

  if (existing) {
    return NextResponse.json({ success: true, alreadyInvited: true }, { status: 200 });
  }

  await db.transaction(async (tx) => {
    const [newContact] = await tx
      .insert(gfoContactsTable)
      .values({
        recruiterUserId: user.id,
        candidateUserId: candidateUserId,
        contacter: "recruiter",
      })
      .returning();

    await tx.insert(gfoContactDetailsTable).values({
      contactId: newContact.id,
      status: "pending",
    });
  });

  return NextResponse.json({ success: true, alreadyInvited: false }, { status: 200 });
}

export async function GET() {
  let user;
  try {
    user = await getCurrentUser();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = user.role;
  const userId = user.id;

  if (role === "recruiter") {
    const contacts = await db.query.gfoContactsTable.findMany({
      where: eq(gfoContactsTable.recruiterUserId, userId),
      orderBy: [desc(gfoContactsTable.createdAt)],
      with: {
        candidate: {
          with: { user: true },
        },
        details: true,
      },
    });

    const dto = contacts.map((c) => ({
      id: c.id,
      candidateId: c.candidateUserId,
      candidateName: c.candidate.user.name,
      candidateTitle: c.candidate.professionalTitle || "No Title",
      status: c.details?.status || "pending",
      contactedAt: c.contactedAt.toISOString(),
    }));

    return NextResponse.json(dto);
  }

  if (role === "candidate") {
    const contacts = await db.query.gfoContactsTable.findMany({
      where: eq(gfoContactsTable.candidateUserId, userId),
      orderBy: [desc(gfoContactsTable.createdAt)],
      with: {
        recruiter: {
          with: { user: true, organisation: true },
        },
        details: true,
      },
    });

    const dto = contacts.map((c) => ({
      id: c.id,
      recruiterName: c.recruiter.user.name,
      organisationName: c.recruiter.organisation.name,
      status: c.details?.status || "pending",
      contactedAt: c.contactedAt.toISOString(),
    }));

    return NextResponse.json(dto);
  }

  return NextResponse.json({ error: "Invalid role" }, { status: 403 });
}

export async function PATCH(req: NextRequest) {
  let user;
  try {
    user = await getCurrentUser();
  } catch {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { contactId, status } = (await req.json()) as {
    contactId: string;
    status: string;
  };

  if (!contactId || typeof contactId !== "string") {
    return NextResponse.json({ success: false, error: "Missing contactId" }, { status: 400 });
  }

  if (!["accepted", "rejected"].includes(status)) {
    return NextResponse.json({ success: false, error: "Invalid status" }, { status: 400 });
  }

  const [contact] = await db
    .select()
    .from(gfoContactsTable)
    .where(eq(gfoContactsTable.id, contactId))
    .limit(1);

  if (!contact) {
    return NextResponse.json({ success: false, error: "Contact not found" }, { status: 404 });
  }

  if (contact.candidateUserId !== user.id) {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }

  const [updated] = await db
    .update(gfoContactDetailsTable)
    .set({ status: status })
    .where(eq(gfoContactDetailsTable.contactId, contactId))
    .returning();

  if (!updated) {
    return NextResponse.json({ success: false, error: "Update failed" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}