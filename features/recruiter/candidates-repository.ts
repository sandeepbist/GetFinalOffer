import type { ApiAdapterInterface } from "@/features/common/api/api-local-adapter";
import { ApiResponse } from "@/features/common/api/api-types";
import type { CandidateSummaryDTO } from "./candidates-dto";

export interface RecruiterCandidateRepository {
  getCandidates(params: {
    page: number;
    pageSize: number;
    search?: string;
    minYears?: number;
    company?: string;
  }): Promise<
    ApiResponse<{
      data: CandidateSummaryDTO[];
      total: number;
    }>
  >;
}

export const createRecruiterCandidateRepository = (
  api: ApiAdapterInterface
): RecruiterCandidateRepository => ({
  async getCandidates({ page, pageSize, search, minYears, company }) {
    const params: Record<string, string> = {
      page: String(page),
      pageSize: String(pageSize),
    };
    if (search) params.search = search;
    if (minYears != null) params.minYears = String(minYears);
    if (company) params.company = company;
    return api.get<{
      data: CandidateSummaryDTO[];
      total: number;
    }>("/recruiter/candidates", params);
  },
});
