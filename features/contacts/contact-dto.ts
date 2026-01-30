export interface ContactCreateDTO {
  candidateUserId: string;
}

export interface ContactCreateResponse {
  success: boolean;
  error?: string;
  alreadyInvited?: boolean;
}

export type ContactStatus = "pending" | "accepted" | "rejected";

export interface RecruiterContactDTO {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateTitle: string;
  status: ContactStatus;
  contactedAt: string;
}

export interface CandidateInviteDTO {
  id: string;
  recruiterName: string;
  organisationName: string;
  status: ContactStatus;
  contactedAt: string;
}