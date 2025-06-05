export interface InterviewProgressEntryDTO {
  companyId: number;
  position: string;
  roundsCleared: number;
  totalRounds: number;
  status: string;
  dateCleared: string;
}

export interface CreateCandidateProfileDTO {
  userId: string;
  professionalTitle: string;
  currentRole: string;
  yearsOfExperience: number;
  location: string;
  bio: string;
  skillIds: number[];
  interviewProgress: InterviewProgressEntryDTO[];
  resumeFile: File;
}

export interface CreateCandidateProfileResponseDTO {
  success: true;
}
export interface CreateCandidateResponse {
  success: true;
}
