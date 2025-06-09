import type { PartnerOrganisationDTO } from "./partner-organisations-dto";

export async function fetchPartnerOrganisations(): Promise<
  PartnerOrganisationDTO[]
> {
  const res = await fetch("/api/organisation", {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to load organisations");
  }
  return res.json();
}
export async function updateHiddenOrganisations(
  hiddenOrganisationIds: string[]
): Promise<void> {
  const res = await fetch("/api/organisation", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ hiddenOrganisationIds }),
  });
  if (!res.ok) {
    throw new Error("Failed to update visibility settings");
  }
}
