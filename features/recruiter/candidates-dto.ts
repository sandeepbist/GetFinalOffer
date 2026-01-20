export interface CandidateSummaryDTO {
  id: string;
  name: string;
  title: string;
  image?: string | null;
  location: string;
  yearsExperience: number;
  skills: string[];
  companyCleared: string | null;
  matchHighlight?: string;
  matchScore?: number;
  bio?: string | null;
  aiReasoning?: string;
}
export interface CandidateSearchFilters {
  minYears: number;
  recruiterOrgId: string;
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