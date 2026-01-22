import {
  createContact,
  getRecruiterContacts as repoGetRecruiterContacts,
  getCandidateInvites as repoGetCandidateInvites,
} from "./contact-repository";
import type {
  ContactCreateDTO,
  ContactCreateResponse,
  RecruiterContactDTO,
  CandidateInviteDTO,
  ContactStatus,
} from "./contact-dto";

export function sendInvite(
  dto: ContactCreateDTO
): Promise<ContactCreateResponse> {
  return createContact(dto);
}

export async function getRecruiterContacts(): Promise<RecruiterContactDTO[]> {
  const res = await repoGetRecruiterContacts();
  return res.ok && res.data ? res.data : [];
}

export async function getCandidateInvites(): Promise<CandidateInviteDTO[]> {
  const res = await repoGetCandidateInvites();
  return res.ok && res.data ? res.data : [];
}

export async function respondToInvite(
  contactId: string,
  status: ContactStatus
): Promise<boolean> {
  const res = await fetch("/api/contacts", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contactId, status }),
  });
  return res.ok;
}