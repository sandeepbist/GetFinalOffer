import type { ApiResponse as AdapterResponse } from "@/features/common/api/api-types";
import type {
  CreateCandidateProfileDTO,
  CreateCandidateProfileResponseDTO,
  CandidateFullProfileDTO,
} from "@/features/candidate/candidate-dto";
import type { CreateCandidateResponse } from "@/features/candidate/candidate-dto";
import type { ApiAdapterInterface } from "@/features/common/api/api-local-adapter";

export interface CandidateRepositoryInterface {
  createProfile(
    dto: CreateCandidateProfileDTO,
  ): Promise<AdapterResponse<CreateCandidateResponse>>;
}

export const CandidateRepository = (
  api: ApiAdapterInterface,
): CandidateRepositoryInterface => ({
  async createProfile(dto) {
    const body = new FormData();
    body.append("userId", dto.userId);
    body.append("professionalTitle", dto.professionalTitle);
    body.append("currentRole", dto.currentRole);
    body.append("yearsExperience", String(dto.yearsExperience));
    body.append("location", dto.location);
    body.append("bio", dto.bio);
    body.append("skillIds", JSON.stringify(dto.skillIds));
    body.append("interviewProgress", JSON.stringify(dto.interviewProgress));
    body.append("resume", dto.resumeFile);

    return await api.post<CreateCandidateProfileResponseDTO>(
      "/candidate",
      body,
    );
  },
});

export async function getCandidateFullById(
  id: string,
): Promise<CandidateFullProfileDTO> {
  const res = await fetch(`/api/candidate/${id}`);
  if (!res.ok) throw new Error("Failed to load candidate");
  return res.json();
}
export async function updateCandidateEmbedding(
  userId: string,
  embedding: number[],
): Promise<void> {
  await db
    .update(gfoCandidatesTable)
    .set({ embedding })
    .where(eq(gfoCandidatesTable.userId, userId));
}
