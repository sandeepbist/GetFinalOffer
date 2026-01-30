import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { gfoRecruitersTable } from "@/db/schemas";
import { getCurrentUserId } from "@/lib/auth/current-user";

export async function POST(req: NextRequest) {
  try {
    const userId = await getCurrentUserId();

    const { organisationId } = (await req.json()) as {
      organisationId: string;
    };

    if (!organisationId) {
      return NextResponse.json(
        { success: false, error: "Missing organisationId" },
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
    if (err instanceof Error && err.message.includes("Unauthorized")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}