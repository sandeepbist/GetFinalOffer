import type {
  RecruiterCreateDTO,
  RecruiterCreateResponseDTO,
} from "./recruiter-dto";
import { createRecruiter } from "./recruiter-repository";

export async function registerRecruiter(
  payload: RecruiterCreateDTO
): Promise<RecruiterCreateResponseDTO> {
  return createRecruiter(payload);
}
