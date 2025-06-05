import apiAdapter from "@/features/common/api/api-local-adapter";

export interface CompanyDTO {
  id: number;
  name: string;
}

export interface SkillDTO {
  id: number;
  name: string;
}

export async function getAllCompanies(): Promise<CompanyDTO[]> {
  try {
    const response = await apiAdapter.get<CompanyDTO[]>("/companies");
    if (response.ok && response.data) {
      return response.data;
    }
    console.error("Failed to fetch companies:", response.error);
    return [];
  } catch (err) {
    console.error("Error in getAllCompanies:", err);
    return [];
  }
}

export async function getAllSkills(): Promise<SkillDTO[]> {
  try {
    const response = await apiAdapter.get<SkillDTO[]>("/skills");
    if (response.ok && response.data) {
      return response.data;
    }
    console.error("Failed to fetch skills:", response.error);
    return [];
  } catch (err) {
    console.error("Error in getAllSkills:", err);
    return [];
  }
}
