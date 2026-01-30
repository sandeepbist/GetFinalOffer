import type {
  ContactCreateDTO,
  ContactCreateResponse,
  RecruiterContactDTO,
  CandidateInviteDTO,
} from "./contact-dto";
import type { ApiResponse } from "@/features/common/api/api-types";

export async function createContact(
  dto: ContactCreateDTO
): Promise<ContactCreateResponse> {
  try {
    const res = await fetch("/api/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });

    const data = await res.json();
    return data as ContactCreateResponse;
  } catch (err) {
    return { success: false, error: `Network error: ${String(err)}` };
  }
}

export async function getRecruiterContacts(): Promise<
  ApiResponse<RecruiterContactDTO[]>
> {
  try {
    const res = await fetch("/api/contacts?type=recruiter");
    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        statusText: res.statusText,
        error: await res.text(),
      };
    }
    const data = await res.json();
    return { ok: true, status: 200, statusText: "OK", data };
  } catch (err) {
    return {
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      error: String(err),
    };
  }
}

export async function getCandidateInvites(): Promise<
  ApiResponse<CandidateInviteDTO[]>
> {
  try {
    const res = await fetch("/api/contacts?type=candidate");
    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        statusText: res.statusText,
        error: await res.text(),
      };
    }
    const data = await res.json();
    return { ok: true, status: 200, statusText: "OK", data };
  } catch (err) {
    return {
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      error: String(err),
    };
  }
}