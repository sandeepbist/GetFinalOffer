import apiAdapter from "@/features/common/api/api-local-adapter";
import { createRecruiterCandidateRepository } from "./candidates-repository";

const repo = createRecruiterCandidateRepository(apiAdapter);

export async function getVisibleCandidates(
  page = 1,
  pageSize = 10,
  search?: string,
  minYears?: number,
  company?: string,
) {
  const res = await repo.getCandidates({
    page,
    pageSize,
    search,
    minYears,
    company,
  });
  if (!res.ok) throw new Error(res.error || "Failed to load candidates");

  return res.data!;
}
