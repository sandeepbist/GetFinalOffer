import apiAdapter from "@/features/common/api/api-local-adapter";
import type {
  CandidateProfileSummaryDTO,
  CreateCandidateProfileDTO,
  CreateCandidateResponse,
  InterviewProgressEntryDTO,
  UpdateCandidateProfileDTO,
  VerificationRequestDTO,
  VerificationResponseDTO,
  ResumeUploadResponseDTO,
} from "./candidate-dto";
import type { CompanyDTO } from "./dashboard/components/SingleCompanySelect";
import type { SkillDTO } from "./dashboard/components/SkillMultiSelect";
import { getCandidateFullById as repoGet } from "./candidate-repository";

export async function getCandidateProfile(): Promise<CandidateProfileSummaryDTO | null> {
  const res = await apiAdapter.get<CandidateProfileSummaryDTO>("/candidate");
  return res.ok && res.data ? res.data : null;
}

export function getCandidateFullById(id: string) {
  return repoGet(id);
}

export async function createCandidateProfile(
  dto: CreateCandidateProfileDTO
): Promise<boolean> {
  const body = new FormData();
  // The server derives the user from the session; only the profile fields
  // and the resume file travel in the request.
  body.append(
    "profile",
    JSON.stringify({
      professionalTitle: dto.professionalTitle,
      currentRole: dto.currentRole,
      yearsExperience: dto.yearsExperience,
      location: dto.location,
      bio: dto.bio,
      skillIds: dto.skillIds,
      interviewProgress: dto.interviewProgress,
    })
  );
  body.append("resume", dto.resumeFile);

  const res = await apiAdapter.post<CreateCandidateResponse>("/candidate", body);
  return res.ok;
}

export async function updateCandidateProfile(
  dto: Omit<
    UpdateCandidateProfileDTO,
    "userId" | "resumeFile" | "interviewProgress"
  >
): Promise<boolean> {
  const res = await apiAdapter.put("/candidate", dto);
  return res.ok;
}

export async function saveInterviewProgress(
  entries: InterviewProgressEntryDTO[]
): Promise<boolean> {
  const res = await apiAdapter.patch("/candidate", {
    action: "progress",
    progress: entries,
  });
  return res.ok;
}

export async function uploadCandidateResume(
  file: File
): Promise<string | null> {
  const body = new FormData();
  body.append("resume", file);

  const raw = await fetch("/api/candidate", { method: "PATCH", body });

  if (!raw.ok) return null;

  const json: unknown = await raw.json();

  if (isResumeUploadResponse(json)) {
    return json.resumeUrl;
  }

  if (isResumeUploadEnvelope(json)) {
    return json.data.resumeUrl;
  }

  return null;
}

function isResumeUploadResponse(data: unknown): data is ResumeUploadResponseDTO {
  return (
    typeof data === "object" &&
    data !== null &&
    "resumeUrl" in data &&
    typeof (data as ResumeUploadResponseDTO).resumeUrl === "string"
  );
}

function isResumeUploadEnvelope(
  data: unknown
): data is { success: true; data: ResumeUploadResponseDTO } {
  return (
    typeof data === "object" &&
    data !== null &&
    "success" in data &&
    (data as { success?: unknown }).success === true &&
    "data" in data &&
    isResumeUploadResponse((data as { data?: unknown }).data)
  );
}

export async function getAllCompanies(): Promise<CompanyDTO[]> {
  const res = await apiAdapter.get<CompanyDTO[]>("/companies");
  return res.ok && res.data ? res.data : [];
}

export async function getAllSkills(): Promise<SkillDTO[]> {
  const res = await apiAdapter.get<SkillDTO[]>("/skills");
  return res.ok && res.data ? res.data : [];
}

export async function requestCandidateVerification(
  payload: VerificationRequestDTO
): Promise<boolean> {
  const form = new FormData();

  form.append("action", payload.action);
  form.append("subject", payload.subject);
  form.append("notes", payload.notes);
  payload.files.forEach((f) => form.append("files", f));

  if (payload.action === "interview") {
    form.append("interviewProgressId", payload.interviewProgressId);
  }

  const res = await apiAdapter.post<VerificationResponseDTO>(
    "/verification/candidate",
    form
  );

  return res.ok && res.data?.success === true;
}
