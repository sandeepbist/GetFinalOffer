import { eq } from "drizzle-orm";
import db from "@/db";
import { gfoRecruitersTable } from "@/db/schemas";
import { getCurrentUser } from "@/lib/auth/current-user";
import { ApiErrors, successResponse } from "@/features/common/api/response";

export async function POST() {
  try {
    const user = await getCurrentUser();

    if (user.role !== "recruiter") {
      return ApiErrors.forbidden("Recruiter access required");
    }

    const updated = await db
      .update(gfoRecruitersTable)
      .set({
        verificationStatus: "pending",
        verificationRequestedAt: new Date(),
      })
      .where(eq(gfoRecruitersTable.userId, user.id))
      .returning({ userId: gfoRecruitersTable.userId });

    if (updated.length === 0) {
      return ApiErrors.notFound("Recruiter profile");
    }

    return successResponse();
  } catch (err) {
    if (err instanceof Error && err.message.includes("Unauthorized")) {
      return ApiErrors.unauthorized();
    }
    console.error("Error requesting recruiter verification:", err);
    return ApiErrors.serverError();
  }
}
