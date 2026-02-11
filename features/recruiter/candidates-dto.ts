export interface CandidateSummaryDTO {
  id: string;
  name: string;
  title: string;
  image?: string | null;
  email?: string | null;
  location: string;
  yearsExperience: number;
  skills: string[];
  companyCleared: string | null;
  matchHighlight?: string;
  matchScore?: number;
  bio?: string | null;
  aiReasoning?: string;
  verificationStatus?: string;
  resumeUrl?: string;
  profilePreview?: CandidateProfilePreviewDTO;
}

export interface CandidateInterviewPreviewDTO {
  id: string;
  companyId: string;
  companyName: string;
  position: string;
  roundsCleared: number;
  totalRounds: number;
  status: string;
  verificationStatus: string;
  dateCleared: string;
}

export interface CandidateProfilePreviewDTO {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  title: string;
  currentRole?: string | null;
  location: string;
  yearsExperience: number;
  bio?: string | null;
  verificationStatus: string;
  resumeUrl: string;
  skills: string[];
  interviewProgress: CandidateInterviewPreviewDTO[];
}

export interface CandidateSearchFilters {
  minYears: number;
  recruiterOrgId: string;
  companyId?: string;
}
export interface CandidateMatchResult {
  candidate_id: string;
  match_score: number;
  match_content: string;
}

export interface SearchResult {
  data: CandidateSummaryDTO[];
  total: number;
}
