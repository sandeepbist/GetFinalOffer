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
  success: true;
}

export interface CreateCandidateResponse {
  success: true;
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
