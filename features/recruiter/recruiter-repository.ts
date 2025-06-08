import type {
  RecruiterCreateDTO,
  RecruiterCreateResponseDTO,
} from "./recruiter-dto";

export async function createRecruiter(
  data: RecruiterCreateDTO
): Promise<RecruiterCreateResponseDTO> {
  const res = await fetch("/api/recruiter", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();
    return { success: false, error: text || "Failed to create recruiter" };
  }
  return res.json();
}
