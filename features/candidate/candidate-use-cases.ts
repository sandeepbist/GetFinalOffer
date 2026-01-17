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
  body.append("userId", dto.userId);
  body.append("professionalTitle", dto.professionalTitle);
  body.append("currentRole", dto.currentRole);
  body.append("yearsExperience", String(dto.yearsExperience));
  body.append("location", dto.location);
  body.append("verificationStatus", dto.verificationStatus);
  body.append("bio", dto.bio);
  body.append("skillIds", JSON.stringify(dto.skillIds));
  body.append("interviewProgress", JSON.stringify(dto.interviewProgress));
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
    "/api/verification/candidate",
    form
  );

  return res.ok && res.data?.success === true;
}