export interface CandidateSummaryDTO {
  id: string;
  name: string;
  title: string;
  location: string;
  yearsExperience: number;
  skills: string[];
  companyCleared: string | null;
  matchHighlight?: string;
  matchScore?: number;
}
export interface CandidateSearchFilters {
  minYears: number;
  recruiterOrgId: string;
}