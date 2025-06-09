import { createContact } from "./contact-repository";
import type { ContactCreateDTO, ContactCreateResponse } from "./contact-dto";

export function sendInvite(
  dto: ContactCreateDTO
): Promise<ContactCreateResponse> {
  return createContact(dto);
}
