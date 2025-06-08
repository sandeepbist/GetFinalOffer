import {
  fetchPartnerOrganisations,
  updateHiddenOrganisations,
} from "./partner-organisations-repository";
import type { PartnerOrganisationDTO } from "./partner-organisations-dto";

export async function getAllPartnerOrganisations(): Promise<
  PartnerOrganisationDTO[]
> {
  return fetchPartnerOrganisations();
}
export async function setHiddenOrganisationsForCandidate(
  organisationIds: string[]
): Promise<void> {
  await updateHiddenOrganisations(organisationIds);
}
