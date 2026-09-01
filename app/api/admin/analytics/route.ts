import { z } from "zod";
import { getAdminAnalytics, assertAdmin } from "@/features/admin/admin-data-access";
import { ApiErrors, successResponse } from "@/features/common/api/response";
import { zodFieldErrors } from "@/features/common/api/validation";

export const dynamic = "force-dynamic";

const windowSchema = z.object({
  days: z.coerce.number().int().min(1).max(90).default(14),
});

export async function GET(req: Request) {
  const admin = await assertAdmin();
  if (!admin.ok) {
    return ApiErrors.forbidden("Admin access required");
  }

  try {
    const url = new URL(req.url);
    const parsed = windowSchema.safeParse({
      days: url.searchParams.get("days") ?? undefined,
    });
    if (!parsed.success) {
      return ApiErrors.validationError(zodFieldErrors(parsed.error));
    }

    const analytics = await getAdminAnalytics(parsed.data.days);
    return successResponse(analytics);
  } catch (err) {
    console.error("Admin analytics failed:", err);
    return ApiErrors.serverError();
  }
}
