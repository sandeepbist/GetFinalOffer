import apiAdapter from "@/features/common/api/api-local-adapter";

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

export async function getVerificationReviewQueue(): Promise<
  VerificationReviewRequestDTO[]
> {
  const res = await apiAdapter.get<{
    requests: VerificationReviewRequestDTO[];
  }>("/verification/review");
  return res.ok && res.data ? res.data.requests : [];
}

export async function submitVerificationDecision(
  dto: VerificationDecisionDTO
): Promise<boolean> {
  const res = await apiAdapter.post("/verification/review", dto);
  return res.ok;
}
