import type { ContactCreateDTO, ContactCreateResponse } from "./contact-dto";

export async function createContact(
  dto: ContactCreateDTO
): Promise<ContactCreateResponse> {
  const res = await fetch("/api/contacts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
  if (!res.ok) {
    const text = await res.text();
    return { success: false, error: text || "API error" };
  }
  return res.json();
}
