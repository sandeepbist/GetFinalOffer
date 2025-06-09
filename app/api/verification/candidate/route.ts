import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import fs from "fs";
import path from "path";
import { eq } from "drizzle-orm";
import db from "@/db";
import {
  gfoCandidatesTable,
  gfoCandidateInterviewProgressTable,
  gfoInterviewDocumentsTable,
} from "@/db/schemas";
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
  if (!req.headers.get("content-type")?.startsWith("multipart/form-data")) {
    return NextResponse.json(
      { success: false, error: "Invalid content type" },
      { status: 400 }
    );
  }

  const form = await req.formData();
  const action = form.get("action")?.toString();
  if (!action || (action !== "profile" && action !== "interview")) {
    return NextResponse.json(
      { success: false, error: "Invalid action" },
      { status: 400 }
    );
  }

  let userId: string;
  try {
    userId = await getUserId(req);
  } catch {
    return NextResponse.json(
      { success: false, error: "Authentication required" },
      { status: 401 }
    );
  }

  if (action === "profile") {
    await db
      .update(gfoCandidatesTable)
      .set({
        verificationStatus: "pending",
        verificationRequestedAt: new Date(),
      })
      .where(eq(gfoCandidatesTable.userId, userId));

    return NextResponse.json({ success: true });
  }

  const progId = form.get("interviewProgressId")?.toString();
  if (!progId) {
    return NextResponse.json(
      { success: false, error: "Missing interviewProgressId" },
      { status: 400 }
    );
  }

  await db
    .update(gfoCandidateInterviewProgressTable)
    .set({ verificationStatus: "pending", verificationRequestedAt: new Date() })
    .where(eq(gfoCandidateInterviewProgressTable.id, progId));

  const files: File[] = [];
  form.forEach((value, key) => {
    if (key === "files" && value instanceof File) {
      files.push(value);
    }
  });
  const subject = form.get("subject")?.toString() || "";
  const note = form.get("notes")?.toString() || "";
  const uploadsDir = path.join(
    process.cwd(),
    "public",
    "uploads",
    "verifications",
    "candidate",
    "interview",
    String(progId)
  );
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

  for (const file of files) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadsDir, filename);
    await fs.promises.writeFile(filePath, buffer);
    const url = `/uploads/verifications/candidate/interview/${progId}/${filename}`;

    await db.insert(gfoInterviewDocumentsTable).values({
      interviewProgressId: progId,
      documentUrl: url,
      subject,
      note,
    });
  }

  return NextResponse.json({ success: true });
}
