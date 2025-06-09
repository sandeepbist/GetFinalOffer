export interface ContactCreateDTO {
  candidateUserId: string;
}
export interface ContactCreateResponse {
  success: boolean;
  error?: string;
  alreadyInvited: boolean;
}
