export interface SkillDef {
  id: string;
  name: string;
  category: string;
  aliases?: string[];
  tags?: string[];
}

export interface RoleDef {
  id: string;
  title: string;
  aliases?: string[];
  skills: Array<{ skillId: string; weight: number }>;
  tags?: string[];
}

export interface RelDef {
  from: string;
  to: string;
  type: "REQUIRES" | "RELATED_TO" | "COMPLEMENTARY" | "ALTERNATIVE_TO";
  weight: number;
  directed?: boolean;
}

export function s(id: string, name: string, category: string, aliases?: string[], tags?: string[]): SkillDef {
  return { id, name, category, aliases, tags };
}

export function req(skillId: string, weight: number): { skillId: string; weight: number } {
  return { skillId, weight };
}
