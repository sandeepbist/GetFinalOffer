export interface AdminKpisDTO {
  candidates: number;
  recruiters: number;
  pendingVerifications: number;
  searches24h: number;
  invites24h: number;
  indexedSkillAssignments: number;
  graphFallbackRate24h: number | null;
}

export interface AdminRecentVerificationRequestDTO {
  id: string;
  scope: string;
  subject: string;
  status: string;
  requestedAt: string;
  requesterName: string | null;
}

export interface AdminRecentSearchDTO {
  query: string;
  resultsCount: number;
  createdAt: string;
}

export interface AdminOverviewDTO {
  kpis: AdminKpisDTO;
  recentVerificationRequests: AdminRecentVerificationRequestDTO[];
  recentSearches: AdminRecentSearchDTO[];
}

export interface AdminAnalyticsDTO {
  windowDays: number;
  funnel: {
    searches: number;
    clicks: number;
    profileViews: number;
  };
  daily: Array<{
    day: string;
    searches: number;
    clicks: number;
    profileViews: number;
  }>;
  topQueries: Array<{ query: string; count: number }>;
}

export interface AdminGraphHealthDTO {
  windowHours: number;
  totals: {
    attempted: number;
    fallback: number;
    fallbackRate: number | null;
    zeroExpansion: number;
    zeroExpansionRate: number | null;
    newCandidatesFound: number;
    graphSyncSuccess: number;
    graphSyncFailure: number;
  };
  latency: { p50: number; p95: number };
  rollouts: Array<{
    mode: string;
    trafficPercent: number;
    blendVariant: string | null;
    createdAt: string;
    metadata: unknown;
  }>;
}

export interface VerificationDocumentDTO {
  requestId: string;
  storagePath: string;
  originalFileName: string;
  mimeType: string;
  sizeBytes: number;
  signedUrl: string | null;
}

export interface VerificationReviewRequestDTO {
  id: string;
  scope: string;
  targetId: string;
  requestedByUserId: string;
  requesterName: string | null;
  requesterEmail: string | null;
  subject: string;
  notes: string | null;
  status: string;
  requestedAt: string;
  documents: VerificationDocumentDTO[];
}

export interface VerificationDecisionDTO {
  requestId: string;
  decision: "approved" | "rejected";
  decisionNote?: string;
}
