import fs from "fs";
import path from "path";
import { detectDirectionalCycles } from "./detect-cycles";

interface SkillNode {
  id: string;
  name: string;
  source?: string;
  sourceId?: string;
  tags?: string[];
  qualityScore?: number;
  sources?: string[];
}

interface RoleNode {
  id: string;
  title: string;
  source?: string;
  sourceId?: string;
  tags?: string[];
  qualityScore?: number;
  sources?: string[];
}

interface AliasNode {
  alias: string;
  skillId?: string;
  roleId?: string;
  type: "skill" | "role";
  source?: string;
  sourceId?: string;
  tags?: string[];
  qualityScore?: number;
}

interface RoleRequirement {
  roleId: string;
  skillId: string;
  weight: number;
}

interface SkillRelation {
  fromSkillId: string;
  toSkillId: string;
  relationType: string;
  weight: number;
  directed?: boolean;
  source?: string;
}

interface TaxonomyDoc {
  version: number;
  domain?: string;
  generatedAt?: string;
  sources?: string[];
  skills: SkillNode[];
  roles: RoleNode[];
  aliases: AliasNode[];
  roleRequirements: RoleRequirement[];
  skillRelations: SkillRelation[];
}

export function validateTaxonomyDocument(doc: TaxonomyDoc): string[] {
  const errors: string[] = [];
  const skillIds = new Set(doc.skills.map((s) => s.id));
  const roleIds = new Set(doc.roles.map((r) => r.id));

  if (doc.skills.length === 0) {
    errors.push("skills array must not be empty");
  }

  for (const req of doc.roleRequirements) {
    if (!roleIds.has(req.roleId)) {
      errors.push(`roleRequirements contains unknown roleId: ${req.roleId}`);
    }
    if (!skillIds.has(req.skillId)) {
      errors.push(`roleRequirements contains unknown skillId: ${req.skillId}`);
    }
  }

  for (const relation of doc.skillRelations) {
    if (!skillIds.has(relation.fromSkillId)) {
      errors.push(`skillRelations contains unknown fromSkillId: ${relation.fromSkillId}`);
    }
    if (!skillIds.has(relation.toSkillId)) {
      errors.push(`skillRelations contains unknown toSkillId: ${relation.toSkillId}`);
    }
  }

  for (const alias of doc.aliases) {
    if (!alias.alias || alias.alias.trim().length === 0) {
      errors.push("aliases cannot contain empty alias values");
      continue;
    }
    if (alias.type === "skill" && alias.skillId && !skillIds.has(alias.skillId)) {
      errors.push(`alias '${alias.alias}' points to missing skillId: ${alias.skillId}`);
    }
    if (alias.type === "role" && alias.roleId && !roleIds.has(alias.roleId)) {
      errors.push(`alias '${alias.alias}' points to missing roleId: ${alias.roleId}`);
    }
  }

  const seenEdges = new Set<string>();
  for (const relation of doc.skillRelations) {
    const edgeKey = `${relation.fromSkillId}|${relation.toSkillId}|${relation.relationType}`;
    if (seenEdges.has(edgeKey)) {
      errors.push(`duplicate skill relation detected: ${edgeKey}`);
    }
    seenEdges.add(edgeKey);
  }

  const cycles = detectDirectionalCycles(doc);
  if (cycles.length > 0) {
    errors.push(...cycles.map((cycle) => `directional cycle: ${cycle}`));
  }

  return errors;
}

export function main() {
  const args = process.argv.slice(2).filter((arg) => arg !== "--");
  let filePath: string | undefined;

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if ((arg === "--input" || arg === "-i") && args[i + 1]) {
      filePath = args[i + 1];
      break;
    }
    if (!arg.startsWith("-")) {
      filePath = arg;
      break;
    }
  }

  const resolvedPath = filePath
    ? path.resolve(process.cwd(), filePath)
    : path.resolve(process.cwd(), "data/skill-graph/taxonomy.v1.json");

  const raw = fs.readFileSync(resolvedPath, "utf8");
  const taxonomy = JSON.parse(raw) as TaxonomyDoc;
  const errors = validateTaxonomyDocument(taxonomy);

  if (errors.length === 0) {
    console.log(`Taxonomy v${taxonomy.version} validated successfully.`);
    process.exit(0);
  }

  console.error("Taxonomy validation failed:");
  errors.forEach((error) => console.error(` - ${error}`));
  process.exit(1);
}

const isDirectRun = (process.argv[1] || "").toLowerCase().includes("validate-taxonomy");
if (isDirectRun) {
  main();
}
