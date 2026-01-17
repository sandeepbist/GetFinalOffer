import { VerificationStatus } from "./dashboard/components/VerifyCallout";

export interface InterviewProgressEntryDTO {
  id: string;
  companyId: string;
  position: string;
  roundsCleared: number;
  totalRounds: number;
  status: string;
  verificationStatus: VerificationStatus;
  dateCleared: string;
}

export interface CreateCandidateProfileDTO {
  userId: string;
  professionalTitle: string;
  currentRole: string;
  yearsExperience: number;
  location: string;
  bio: string;
  verificationStatus: VerificationStatus;
  skillIds: string[];
  interviewProgress: InterviewProgressEntryDTO[];
  resumeFile: File;
}

export interface CreateCandidateProfileResponseDTO {
  success: boolean;
}

export interface CreateCandidateResponse {
  success: boolean;
}

export interface CandidateProfileSummaryDTO {
  userId: string;
  professionalTitle: string;
  currentRole: string;
  yearsExperience: number;
  location: string;
  bio: string;
  resumeUrl: string;
  skillIds: string[];
  interviewProgress: InterviewProgressEntryDTO[];
  verificationStatus: VerificationStatus;
}

export interface CandidateFullProfileDTO {
  user: {
    name: string;
    email: string;
    image: string;
  };
  profile: CandidateProfileSummaryDTO;
}

export type UpdateCandidateProfileDTO = {
  professionalTitle: string;
  currentRole: string;
  yearsExperience: number;
  location: string;
  bio: string;
  skillIds: string[];
};

export interface VerificationBaseDTO {
  subject: string;
  notes: string;
  files: File[];
}

export interface VerificationProfileRequestDTO extends VerificationBaseDTO {
  action: "profile";
}

export interface VerificationInterviewRequestDTO extends VerificationBaseDTO {
  action: "interview";
  interviewProgressId: string;
}

export type VerificationRequestDTO =
  | VerificationProfileRequestDTO
  | VerificationInterviewRequestDTO;

export interface VerificationResponseDTO {
  success: boolean;
  error?: string;
}

export interface ResumeUploadResponseDTO {
  resumeUrl: string;
}