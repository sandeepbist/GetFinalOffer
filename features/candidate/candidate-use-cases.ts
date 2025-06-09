import apiAdapter from "@/features/common/api/api-local-adapter";
import type {
  CandidateProfileSummaryDTO,
  CreateCandidateProfileDTO,
  InterviewProgressEntryDTO,
  UpdateCandidateProfileDTO,
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
  Object.entries({
    userId: dto.userId,
    professionalTitle: dto.professionalTitle,
    currentRole: dto.currentRole,
    yearsExperience: String(dto.yearsExperience),
    location: dto.location,
    verificationStatus: dto.verificationStatus,
    bio: dto.bio,
    skillIds: JSON.stringify(dto.skillIds),
    interviewProgress: JSON.stringify(dto.interviewProgress),
  }).forEach(([k, v]) => body.append(k, v));
  body.append("resume", dto.resumeFile);
  const raw = await fetch("/api/candidate", { method: "POST", body });
  return raw.ok;
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
  const json = await raw.json();
  return (json as any).resumeUrl;
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
  action: "profile",
  payload: { subject: string; notes: string; links: string; files: File[] }
): Promise<boolean>;
export async function requestCandidateVerification(
  action: "interview",
  payload: {
    subject: string;
    notes: string;
    links: string;
    files: File[];
    interviewProgressId: string;
  }
): Promise<boolean>;
export async function requestCandidateVerification(
  action: "profile" | "interview",
  payload: any
): Promise<boolean> {
  const form = new FormData();
  form.append("action", action);
  form.append("subject", payload.subject);
  form.append("notes", payload.notes);
  form.append("links", payload.links);
  if (action === "interview") {
    form.append("interviewProgressId", String(payload.interviewProgressId));
  }
  payload.files.forEach((f: File) => form.append("files", f));
  const res = await fetch("/api/verification/candidate", {
    method: "POST",
    body: form,
  });
  const json = await res.json();
  return res.ok && json.success === true;
}
