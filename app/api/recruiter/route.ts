import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { gfoRecruitersTable } from "@/db/schemas";

export async function POST(req: NextRequest) {
  try {
    const { userId, organisationId } = (await req.json()) as {
      userId: string;
      organisationId: string;
    };

    if (!userId || !organisationId) {
      return NextResponse.json(
        { success: false, error: "Missing userId or organisationId" },
        { status: 400 },
      );
    }

    await db
      .insert(gfoRecruitersTable)
      .values({
        userId,
        organisationId,
      })
      .onConflictDoNothing({ target: gfoRecruitersTable.userId });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error creating recruiter:", err);
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    );
  }
}
