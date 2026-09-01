import { z } from "zod";
import { getAdminGraphHealth, assertAdmin } from "@/features/admin/admin-data-access";
import { ApiErrors, successResponse } from "@/features/common/api/response";
import { zodFieldErrors } from "@/features/common/api/validation";

export const dynamic = "force-dynamic";

const windowSchema = z.object({
  hours: z.coerce.number().int().min(1).max(168).default(24),
});

export async function GET(req: Request) {
  const admin = await assertAdmin();
  if (!admin.ok) {
    return ApiErrors.forbidden("Admin access required");
  }

  try {
    const url = new URL(req.url);
    const parsed = windowSchema.safeParse({
      hours: url.searchParams.get("hours") ?? undefined,
    });
    if (!parsed.success) {
      return ApiErrors.validationError(zodFieldErrors(parsed.error));
    }

    const health = await getAdminGraphHealth(parsed.data.hours);
    return successResponse(health);
  } catch (err) {
    console.error("Admin graph health failed:", err);
    return ApiErrors.serverError();
  }
}
