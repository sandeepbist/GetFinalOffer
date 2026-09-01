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
    const body = await res.json().catch(() => null);
    const message =
      (body && typeof body.error === "string" && body.error) ||
      "Failed to create recruiter";
    return { success: false, error: message };
  }
  return res.json();
}
