import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import fs from "fs";
import path from "path";
import {
  insertCandidate,
  insertCandidateSkills,
  insertInterviewProgress,
} from "@/features/candidate/candidate-data-access";
import type {
  CreateCandidateProfileResponseDTO,
  InterviewProgressEntryDTO,
} from "@/features/candidate/candidate-dto";

export const config = {
  api: { bodyParser: false },
};

export async function POST(
  req: NextRequest
): Promise<
  NextResponse<
    CreateCandidateProfileResponseDTO | { success: false; error: string }
  >
> {
  try {
    const formData = await req.formData();

    const userId = formData.get("userId")?.toString() || "";
    const professionalTitle =
      formData.get("professionalTitle")?.toString() || "";
    const currentRole = formData.get("currentRole")?.toString() || "";
    const yearsStr = formData.get("yearsExperience")?.toString() || "0";
    const location = formData.get("location")?.toString() || "";
    const bio = formData.get("bio")?.toString() || "";
    const skillJson = formData.get("skillIds")?.toString() || "[]";
    const interviewJson = formData.get("interviewProgress")?.toString() || "[]";

    const yearsOfExperience = parseInt(yearsStr, 10);
    const skillIds = JSON.parse(skillJson) as number[];
    const interviewProgress = JSON.parse(
      interviewJson
    ) as InterviewProgressEntryDTO[];

    const resumeBlob = formData.get("resume") as Blob;
    if (!resumeBlob) {
      return NextResponse.json(
        { success: false, error: "No resume file provided" },
        { status: 400 }
      );
    }

    const arrayBuffer = await resumeBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadsDir = path.join(process.cwd(), "public", "uploads", "resumes");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const originalName = (resumeBlob as any).name || "resume";
    const timestamp = Date.now();
    const ext = path.extname(originalName) || ".pdf";
    const safeBase = path
      .basename(originalName, ext)
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9_\-]/g, "");
    const finalName = `${timestamp}-${safeBase}${ext}`;
    const destPath = path.join(uploadsDir, finalName);

    await fs.promises.writeFile(destPath, buffer);
    const resumeUrl = `/uploads/resumes/${finalName}`;

    await insertCandidate({
      userId,
      professionalTitle,
      currentRole,
      yearsOfExperience,
      location,
      bio,
      resumeUrl,
    });

    if (skillIds.length > 0) {
      await insertCandidateSkills(userId, skillIds);
    }

    if (interviewProgress.length > 0) {
      const progressEntries = interviewProgress.map((entry) => ({
        companyId: entry.companyId,
        position: entry.position,
        roundsCleared: entry.roundsCleared,
        totalRounds: entry.totalRounds,
        status: entry.status,
        dateCleared: new Date(entry.dateCleared),
      }));
      await insertInterviewProgress(userId, progressEntries);
    }

    const response: CreateCandidateProfileResponseDTO = { success: true };
    return NextResponse.json(response, { status: 200 });
  } catch (err: any) {
    console.error("Error in /api/candidate", err);
    return NextResponse.json(
      { success: false, error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
