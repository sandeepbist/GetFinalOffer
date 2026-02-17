import type { ApiAdapterInterface, ApiRequestOptions } from "@/features/common/api/api-local-adapter";
import { ApiResponse } from "@/features/common/api/api-types";
import type { CandidateSummaryDTO, GraphSearchTelemetryDTO } from "./candidates-dto";

export interface RecruiterCandidateRepository {
  getCandidates(params: {
    page: number;
    pageSize: number;
    search?: string;
    minYears?: number;
    companyId?: string;
    options?: ApiRequestOptions;
  }): Promise<
    ApiResponse<{
      data: CandidateSummaryDTO[];
      total: number;
      graphTelemetry?: GraphSearchTelemetryDTO;
    }>
  >;
}

export const createRecruiterCandidateRepository = (
  api: ApiAdapterInterface
): RecruiterCandidateRepository => ({
  async getCandidates({ page, pageSize, search, minYears, companyId, options }) {
    const params: Record<string, string> = {
      page: String(page),
      pageSize: String(pageSize),
    };
    if (search) params.search = search;
    if (minYears != null) params.minYears = String(minYears);
    if (companyId) params.companyId = companyId;
    return api.get<{
      data: CandidateSummaryDTO[];
      total: number;
      graphTelemetry?: GraphSearchTelemetryDTO;
    }>("/recruiter/candidates", params, options);
  },
});
