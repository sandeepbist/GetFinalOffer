import { getAdminOverview, assertAdmin } from "@/features/admin/admin-data-access";
import { ApiErrors, successResponse } from "@/features/common/api/response";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await assertAdmin();
  if (!admin.ok) {
    return ApiErrors.forbidden("Admin access required");
  }

  try {
    const overview = await getAdminOverview();
    return successResponse(overview);
  } catch (err) {
    console.error("Admin overview failed:", err);
    return ApiErrors.serverError();
  }
}
