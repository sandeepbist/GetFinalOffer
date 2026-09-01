import apiAdapter from "@/features/common/api/api-local-adapter";
import type {
  AdminOverviewDTO,
  AdminAnalyticsDTO,
  AdminGraphHealthDTO,
  VerificationReviewRequestDTO,
  VerificationDecisionDTO,
} from "./admin-dto";

export async function getAdminOverview(): Promise<AdminOverviewDTO | null> {
  const res = await apiAdapter.get<AdminOverviewDTO>("/admin/overview");
  return res.ok && res.data ? res.data : null;
}

export async function getAdminAnalytics(
  days = 14
): Promise<AdminAnalyticsDTO | null> {
  const res = await apiAdapter.get<AdminAnalyticsDTO>("/admin/analytics", { days });
  return res.ok && res.data ? res.data : null;
}

export async function getAdminGraphHealth(
  hours = 24
): Promise<AdminGraphHealthDTO | null> {
  const res = await apiAdapter.get<AdminGraphHealthDTO>("/admin/graph", { hours });
  return res.ok && res.data ? res.data : null;
}

export async function getVerificationReviewQueue(): Promise<
  VerificationReviewRequestDTO[]
> {
  const res = await apiAdapter.get<{
    requests: VerificationReviewRequestDTO[];
  }>("/verification/review");
  return res.ok && res.data ? res.data.requests : [];
}

export async function submitVerificationDecision(
  dto: VerificationDecisionDTO
): Promise<boolean> {
  const res = await apiAdapter.post("/verification/review", dto);
  return res.ok;
}
