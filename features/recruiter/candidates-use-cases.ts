import apiAdapter from "@/features/common/api/api-local-adapter";
import { createRecruiterCandidateRepository } from "./candidates-repository";

const repo = createRecruiterCandidateRepository(apiAdapter);

export class CandidateSearchError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "CandidateSearchError";
    this.status = status;
  }
}

export async function getVisibleCandidates(
  page = 1,
  pageSize = 10,
  search?: string,
  minYears?: number,
  companyId?: string,
  signal?: AbortSignal,
) {
  const res = await repo.getCandidates({
    page,
    pageSize,
    search,
    minYears,
    companyId,
    options: { signal },
  });

  if (!res.ok) {
    const message =
      (typeof res.error === "string" && res.error) ||
      res.error?.error ||
      "Failed to load candidates";
    throw new CandidateSearchError(message, res.status);
  }

  return res.data!;
}
