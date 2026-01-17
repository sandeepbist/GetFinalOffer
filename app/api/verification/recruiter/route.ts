import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import db from "@/db";
import { gfoRecruitersTable } from "@/db/schemas";
import { betterFetch } from "@better-fetch/fetch";
import type { Session } from "@/lib/auth/auth-types";

export const config = {
  api: { bodyParser: false },
};

async function getUserId(req: NextRequest): Promise<string> {
  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: req.nextUrl.origin,
      headers: { cookie: req.headers.get("cookie") || "" },
    }
  );
  if (!session?.user?.id) throw new Error("Not authenticated");
  return session.user.id;
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserId(req);

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