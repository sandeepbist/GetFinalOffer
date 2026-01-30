import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import db from "@/db";
import { gfoRecruitersTable } from "@/db/schemas";
import { getCurrentUserId } from "@/lib/auth/current-user";

export const config = {
  api: { bodyParser: false },
};

export async function POST() {
  try {
    const userId = await getCurrentUserId();

    await db
      .update(gfoRecruitersTable)
      .set({
        verificationStatus: "pending",
        verificationRequestedAt: new Date(),
      })
      .where(eq(gfoRecruitersTable.userId, userId));

    return NextResponse.json({ success: true });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "An error occurred";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 401 }
    );
  }
}