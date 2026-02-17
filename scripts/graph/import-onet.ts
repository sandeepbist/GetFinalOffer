import fs from "fs";
import path from "path";
import { normalizeSkill } from "@/lib/graph/normalize-skill";
import { parseCsvFile } from "@/scripts/graph/csv";
import type {
  BuildRejectBreakdown,
  TaxonomyAliasNode,
  TaxonomyDocument,
  TaxonomyRoleNode,
  TaxonomySkillNode,
  TaxonomySkillRelation,
} from "@/scripts/graph/taxonomy-types";

interface OnetImportReport {
  generatedAt: string;
  inputPath: string;
  outputPath: string;
  reportPath: string;
  counts: Record<string, number>;
  rejectReasons: BuildRejectBreakdown;
}

function getArg(flag: string, fallback = ""): string {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return fallback;
  return process.argv[idx + 1] || fallback;
}

function incrementReason(breakdown: BuildRejectBreakdown, reason: string): void {
  breakdown[reason] = (breakdown[reason] || 0) + 1;
}

function splitValues(raw: string): string[] {
  return raw
    .split(/[|;\n]/g)
    .map((value) => value.trim())
    .filter((value) => value.length > 0);
}

function toAbsPath(inputPath: string): string {
  return path.resolve(process.cwd(), inputPath);
}

function isTaxonomyDoc(input: unknown): input is TaxonomyDocument {
  const maybe = input as Partial<TaxonomyDocument>;
  return Boolean(
    maybe &&
    Array.isArray(maybe.skills) &&
    Array.isArray(maybe.aliases) &&
    Array.isArray(maybe.roles) &&
    Array.isArray(maybe.roleRequirements) &&
    Array.isArray(maybe.skillRelations)
  );
}

function normalizeKeys(row: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(row)) {
    out[key] = value;
    const snakeKey = key
      .replace(/[*\/\-]+/g, "_")
      .replace(/\s+/g, "_")
      .replace(/__+/g, "_")
      .replace(/^_|_$/g, "")
      .toLowerCase();
    if (snakeKey !== key) {
      out[snakeKey] = value;
    }
  }
  return out;
}

function readRows(inputPath: string): Array<Record<string, string>> {
  const ext = path.extname(inputPath).toLowerCase();
  if (ext === ".json") {
    const raw = fs.readFileSync(inputPath, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) {
      return parsed.map((row) => normalizeKeys(row as Record<string, string>));
    }
    if (isTaxonomyDoc(parsed)) {
      const syntheticRows: Array<Record<string, string>> = [];
      for (const skill of parsed.skills) {
        syntheticRows.push({
          id: skill.id,
          name: skill.name,
          category: skill.category,
        });
      }
      return syntheticRows;
    }
    throw new Error("Unsupported O*NET JSON shape. Provide array rows or taxonomy-like document.");
  }

  return parseCsvFile(inputPath).map(normalizeKeys);
}

function main() {
  const inputPathArg = getArg("--input");
  const outputPath = getArg(
    "--output",
    path.resolve(process.cwd(), "data/skill-graph/taxonomy.v1.onet.json")
  );
  const reportPath = getArg(
    "--report",
    path.resolve(process.cwd(), "data/skill-graph/reports/onet-import-report.json")
  );
  const version = Number(getArg("--version", "1")) || 1;

  if (!inputPathArg) {
    console.error("Usage: tsx scripts/graph/import-onet.ts --input <onet.csv|onet.json> [--output <path>] [--report <path>] [--version <n>]");
    process.exit(1);
  }

  const inputPath = toAbsPath(inputPathArg);
  const rows = readRows(inputPath);

  const report: OnetImportReport = {
    generatedAt: new Date().toISOString(),
    inputPath,
    outputPath,
    reportPath,
    counts: {
      inputRows: rows.length,
      acceptedSkills: 0,
      rejectedRows: 0,
      acceptedAliases: 0,
      duplicateAliasesMerged: 0,
      acceptedRoles: 0,
      acceptedRoleRequirements: 0,
      acceptedRelations: 0,
    },
    rejectReasons: {},
  };

  const skills: TaxonomySkillNode[] = [];
  const roles: TaxonomyRoleNode[] = [];
  const aliases: TaxonomyAliasNode[] = [];
  const skillRelations: TaxonomySkillRelation[] = [];
  const roleRequirements: TaxonomyDocument["roleRequirements"] = [];

  const skillByNormalized = new Map<string, TaxonomySkillNode>();
  const roleByNormalized = new Map<string, TaxonomyRoleNode>();
  const aliasDedupe = new Set<string>();
  const relationDedupe = new Set<string>();

  function ensureSkill(nameRaw: string, categoryRaw: string, sourceIdRaw = ""): TaxonomySkillNode | null {
    const name = nameRaw.trim();
    const normalized = normalizeSkill(name);
    if (!normalized) return null;
    const existing = skillByNormalized.get(normalized);
    if (existing) return existing;

    const sourceId = sourceIdRaw.trim() || `onet-${normalized.replace(/\s+/g, "-")}`;
    const created: TaxonomySkillNode = {
      id: sourceId.toLowerCase(),
      name,
      category: categoryRaw || "onet-skill",
      source: "onet",
      sourceId: sourceIdRaw || undefined,
      qualityScore: 0.75,
      sources: ["onet"],
    };
    skillByNormalized.set(normalized, created);
    skills.push(created);
    report.counts.acceptedSkills += 1;
    return created;
  }

  function ensureRole(titleRaw: string): TaxonomyRoleNode | null {
    const title = titleRaw.trim();
    const normalized = normalizeSkill(title);
    if (!normalized) return null;
    const existing = roleByNormalized.get(normalized);
    if (existing) return existing;
    const created: TaxonomyRoleNode = {
      id: `onet-role-${normalized.replace(/\s+/g, "-")}`,
      title,
      source: "onet",
      qualityScore: 0.7,
      sources: ["onet"],
    };
    roleByNormalized.set(normalized, created);
    roles.push(created);
    report.counts.acceptedRoles += 1;
    return created;
  }

  for (const row of rows) {
    const skillName =
      row.skill ||
      row.skill_name ||
      row.name ||
      row.title ||
      row.element_name ||
      "";

    const category =
      row.category ||
      row.domain ||
      row.type ||
      row.element_type ||
      "onet-skill";

    const sourceId =
      row.skill_id ||
      row.id ||
      row.code ||
      row.element_id ||
      row.o_net_soc_code ||
      "";

    const skill = ensureSkill(skillName, category, sourceId);
    if (!skill) {
      report.counts.rejectedRows += 1;
      incrementReason(report.rejectReasons, "missing_or_invalid_skill_name");
      continue;
    }

    const aliasesRaw =
      row.aliases ||
      row.alt_titles ||
      row.alternate_titles ||
      row.synonyms ||
      "";
    for (const alias of splitValues(aliasesRaw)) {
      const normalizedAlias = normalizeSkill(alias);
      if (!normalizedAlias) continue;
      const aliasKey = `${normalizedAlias}|${skill.id}`;
      if (aliasDedupe.has(aliasKey)) {
        report.counts.duplicateAliasesMerged += 1;
        continue;
      }
      aliasDedupe.add(aliasKey);
      aliases.push({
        alias,
        skillId: skill.id,
        type: "skill",
        source: "onet",
        qualityScore: 0.65,
      });
      report.counts.acceptedAliases += 1;
    }

    const occupationRaw = row.occupation || row.role || row.job_title || row.Title || "";
    const role = occupationRaw ? ensureRole(occupationRaw) : null;
    if (role) {
      roleRequirements.push({
        roleId: role.id,
        skillId: skill.id,
        weight: 0.75,
        source: "onet",
      });
      report.counts.acceptedRoleRequirements += 1;
    }

    const relatedRaw = row.related_skills || row.related || row.relatedSkills || "";
    for (const relatedName of splitValues(relatedRaw)) {
      const relatedSkill = ensureSkill(relatedName, category);
      if (!relatedSkill || relatedSkill.id === skill.id) continue;
      const relationKey = `${skill.id}|${relatedSkill.id}|RELATED_TO`;
      if (relationDedupe.has(relationKey)) continue;
      relationDedupe.add(relationKey);
      skillRelations.push({
        fromSkillId: skill.id,
        toSkillId: relatedSkill.id,
        relationType: "RELATED_TO",
        weight: 0.7,
        directed: false,
        source: "onet",
      });
      report.counts.acceptedRelations += 1;
    }
  }

  const taxonomy: TaxonomyDocument = {
    version,
    domain: "onet",
    generatedAt: new Date().toISOString(),
    sources: ["onet"],
    skills,
    roles,
    aliases,
    roleRequirements,
    skillRelations,
  };

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(taxonomy, null, 2), "utf8");
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), "utf8");

  console.log(
    `O*NET import complete. skills=${skills.length}, aliases=${aliases.length}, roles=${roles.length}, relations=${skillRelations.length}`
  );
  console.log(`Output: ${outputPath}`);
  console.log(`Report: ${reportPath}`);
}

main();
