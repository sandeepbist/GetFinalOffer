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
        { status: 400 }
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
  } catch (err: any) {
    console.error("Error creating recruiter:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
