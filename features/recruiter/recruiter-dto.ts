export interface RecruiterCreateDTO {
  userId: string;
  organisationId: string;
}

export interface RecruiterCreateResponseDTO {
  success: boolean;
  error?: string;
}
