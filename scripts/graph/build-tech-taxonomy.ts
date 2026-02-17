import fs from "fs";
import path from "path";
import { normalizeSkill } from "@/lib/graph/normalize-skill";
import {
  type TaxonomyAliasNode,
  type TaxonomyBuildReport,
  type TaxonomyDocument,
  type TaxonomyRoleNode,
  type TaxonomySkillNode,
  type TaxonomySkillRelation,
  type TaxonomySource,
} from "@/scripts/graph/taxonomy-types";

interface SkillAliasBridge {
  alias: string;
  canonical: string;
}

interface RoleAliasBridge {
  alias: string;
  canonicalRole: string;
}

interface SynonymMappingFile {
  requiredTerms: string[];
  skillAliases: SkillAliasBridge[];
  roleAliases: RoleAliasBridge[];
}

type TaxonomyScope = "tech" | "all";

interface SkillAccumulator {
  id: string;
  normalizedName: string;
  displayName: string;
  category: string;
  source: TaxonomySource;
  sourceId?: string;
  tags: Set<string>;
  sources: Set<TaxonomySource>;
  qualityScore: number;
  classification: "accept" | "borderline" | "reject";
}

interface RoleAccumulator {
  id: string;
  normalizedTitle: string;
  title: string;
  source: TaxonomySource;
  sources: Set<TaxonomySource>;
  qualityScore: number;
}

interface EdgeCandidate {
  from: string;
  to: string;
  relationType: string;
  weight: number;
  directed: boolean;
  source: TaxonomySource;
}

const SOURCE_PRIORITY: Record<TaxonomySource, number> = {
  curated: 4,
  onet: 3,
  esco: 2,
  generated: 1,
};

const SOURCE_QUALITY: Record<TaxonomySource, number> = {
  curated: 0.95,
  onet: 0.8,
  esco: 0.7,
  generated: 0.65,
};

const ALLOWLIST_KEYWORDS = [
  "software",
  "programming",
  "developer",
  "engineering",
  "frontend",
  "backend",
  "full stack",
  "javascript",
  "typescript",
  "node",
  "react",
  "angular",
  "vue",
  "python",
  "java",
  "golang",
  "go ",
  "c#",
  "c++",
  "dotnet",
  "sql",
  "nosql",
  "database",
  "api",
  "graphql",
  "rest",
  "kubernetes",
  "docker",
  "cloud",
  "aws",
  "azure",
  "gcp",
  "linux",
  "devops",
  "ml",
  "machine learning",
  "ai",
  "data engineer",
  "data science",
  "pytorch",
  "tensorflow",
  "scikit",
  "security",
  "cyber",
  "sre",
  "platform engineer",
];

const TECH_SECONDARY_KEYWORDS = [
  "framework",
  "library",
  "script",
  "code",
  "compiler",
  "algorithm",
  "web",
  "application",
  "microservice",
  "distributed",
  "infrastructure",
  "ci/cd",
  "etl",
  "analytics",
];

const DENYLIST_KEYWORDS = [
  "agriculture",
  "animal",
  "casino",
  "cosmetic",
  "nuclear",
  "therapy",
  "anaesthesia",
  "tobacco",
  "flora",
  "vehicle cleaning",
  "culinary",
  "farming",
  "livestock",
  "forensic",
  "police",
  "rehabilitation",
  "pharmacy",
  "veterinary",
  "mining",
];

const BROAD_ROLE_KEYWORDS = [
  "engineer",
  "developer",
  "manager",
  "analyst",
  "specialist",
  "consultant",
  "coordinator",
  "architect",
  "administrator",
  "designer",
  "scientist",
  "technician",
  "executive",
  "associate",
  "officer",
  "director",
  "lead",
  "head",
];

function getArg(flag: string, fallback = ""): string {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return fallback;
  return process.argv[idx + 1] || fallback;
}

function toAbsPath(inputPath: string): string {
  return path.resolve(process.cwd(), inputPath);
}

function toSlug(value: string): string {
  const normalized = normalizeSkill(value);
  return normalized.replace(/\s+/g, "-");
}

function readJson<T>(filePath: string): T {
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw) as T;
}

function emptyTaxonomy(): TaxonomyDocument {
  return {
    version: 1,
    domain: "empty",
    sources: [],
    skills: [],
    roles: [],
    aliases: [],
    roleRequirements: [],
    skillRelations: [],
  };
}

function resolveSource(
  label: TaxonomySource,
  input: Partial<TaxonomyDocument>
): TaxonomyDocument {
  return {
    version: input.version || 1,
    domain: input.domain || label,
    generatedAt: input.generatedAt,
    sources: input.sources || [label],
    skills: input.skills || [],
    roles: input.roles || [],
    aliases: input.aliases || [],
    roleRequirements: input.roleRequirements || [],
    skillRelations: input.skillRelations || [],
  };
}

function classifyTechRelevance(skill: TaxonomySkillNode, source: TaxonomySource): SkillAccumulator["classification"] {
  if (source === "curated") return "accept";

  const value = `${skill.name} ${skill.category} ${(skill.tags || []).join(" ")}`.toLowerCase();
  const hasAllow = ALLOWLIST_KEYWORDS.some((keyword) => value.includes(keyword));
  const hasDeny = DENYLIST_KEYWORDS.some((keyword) => value.includes(keyword));

  if (hasAllow) return "accept";
  if (hasDeny) return "reject";
  if (TECH_SECONDARY_KEYWORDS.some((keyword) => value.includes(keyword))) {
    return "borderline";
  }
  return "reject";
}

function classifySkillRelevance(
  skill: TaxonomySkillNode,
  source: TaxonomySource,
  scope: TaxonomyScope
): SkillAccumulator["classification"] {
  if (scope === "all") {
    const normalized = normalizeSkill(skill.name || "");
    if (!normalized) return "reject";
    return "accept";
  }

  return classifyTechRelevance(skill, source);
}

function pickPreferredSource(a: TaxonomySource, b: TaxonomySource): TaxonomySource {
  return SOURCE_PRIORITY[a] >= SOURCE_PRIORITY[b] ? a : b;
}

function shouldReplaceDisplayName(current: SkillAccumulator, candidateName: string, candidateSource: TaxonomySource): boolean {
  if (candidateSource !== current.source) {
    return SOURCE_PRIORITY[candidateSource] > SOURCE_PRIORITY[current.source];
  }
  return candidateName.length < current.displayName.length;
}

function sortByName<T extends { name?: string; title?: string; alias?: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const left = (a.name || a.title || a.alias || "").toLowerCase();
    const right = (b.name || b.title || b.alias || "").toLowerCase();
    return left.localeCompare(right);
  });
}

function buildFallbackRoleId(title: string): string {
  return `generated-role-${toSlug(title)}`;
}

function main() {
  const scopeRaw = getArg("--scope", "tech").toLowerCase();
  const scope: TaxonomyScope = scopeRaw === "all" ? "all" : "tech";

  const curatedPath = toAbsPath(
    getArg("--curated", "data/skill-graph/taxonomy.v1.json")
  );
  const escoPath = toAbsPath(
    getArg("--esco", "data/skill-graph/taxonomy.v1.esco.json")
  );
  const onetPathArg = getArg("--onet", "");
  const onetPath = onetPathArg ? toAbsPath(onetPathArg) : "";
  const synonymsPath = toAbsPath(
    getArg("--synonyms", "data/skill-graph/mappings/tech-synonyms.json")
  );
  const outputPath = toAbsPath(
    getArg("--output", "data/skill-graph/taxonomy.v2.tech.json")
  );
  const reportPath = toAbsPath(
    getArg("--report", "data/skill-graph/reports/build-tech-taxonomy-report.json")
  );
  const version = Number(getArg("--version", "2")) || 2;

  const curated = resolveSource("curated", readJson<Partial<TaxonomyDocument>>(curatedPath));
  const esco = resolveSource("esco", readJson<Partial<TaxonomyDocument>>(escoPath));
  const onet =
    onetPath && fs.existsSync(onetPath)
      ? resolveSource("onet", readJson<Partial<TaxonomyDocument>>(onetPath))
      : emptyTaxonomy();
  const synonyms = readJson<SynonymMappingFile>(synonymsPath);

  const sourceDocs: Array<{ source: TaxonomySource; doc: TaxonomyDocument }> = [
    { source: "curated", doc: curated },
    { source: "esco", doc: esco },
  ];
  if (onet.skills.length > 0 || onet.aliases.length > 0) {
    sourceDocs.push({ source: "onet", doc: onet });
  }

  const skillByNormalized = new Map<string, SkillAccumulator>();
  const roleByNormalized = new Map<string, RoleAccumulator>();
  const sourceSkillToNormalized = new Map<string, string>();
  const sourceRoleToNormalized = new Map<string, string>();
  const edges: EdgeCandidate[] = [];
  const rejectReasons: Record<string, number> = {};

  const bumpReject = (reason: string) => {
    rejectReasons[reason] = (rejectReasons[reason] || 0) + 1;
  };

  for (const { source, doc } of sourceDocs) {
    for (const skill of doc.skills) {
      const normalized = normalizeSkill(skill.name || "");
      if (!normalized) {
        bumpReject("skill_without_normalized_name");
        continue;
      }

      sourceSkillToNormalized.set(`${source}:${skill.id}`, normalized);

      const classification = classifySkillRelevance(skill, source, scope);
      const existing = skillByNormalized.get(normalized);
      if (!existing) {
        skillByNormalized.set(normalized, {
          id: skill.id || `${source}-${toSlug(skill.name)}`,
          normalizedName: normalized,
          displayName: skill.name,
          category: skill.category || "skill",
          source,
          sourceId: skill.sourceId || skill.id,
          tags: new Set(skill.tags || []),
          sources: new Set([source]),
          qualityScore: SOURCE_QUALITY[source],
          classification,
        });
        continue;
      }

      existing.sources.add(source);
      existing.qualityScore = Math.max(existing.qualityScore, SOURCE_QUALITY[source]);
      existing.classification =
        existing.classification === "accept" || classification === "accept"
          ? "accept"
          : existing.classification === "borderline" || classification === "borderline"
            ? "borderline"
            : "reject";
      for (const tag of skill.tags || []) {
        existing.tags.add(tag);
      }

      if (shouldReplaceDisplayName(existing, skill.name, source)) {
        existing.displayName = skill.name;
        existing.source = pickPreferredSource(existing.source, source);
        existing.category = skill.category || existing.category;
        existing.sourceId = skill.sourceId || skill.id || existing.sourceId;
      }
    }

    for (const role of doc.roles) {
      const normalized = normalizeSkill(role.title || "");
      if (!normalized) continue;
      sourceRoleToNormalized.set(`${source}:${role.id}`, normalized);
      const existing = roleByNormalized.get(normalized);
      if (!existing) {
        roleByNormalized.set(normalized, {
          id: role.id || `${source}-role-${toSlug(role.title)}`,
          normalizedTitle: normalized,
          title: role.title,
          source,
          sources: new Set([source]),
          qualityScore: SOURCE_QUALITY[source],
        });
      } else {
        existing.sources.add(source);
        if (SOURCE_PRIORITY[source] > SOURCE_PRIORITY[existing.source]) {
          existing.source = source;
          existing.title = role.title;
          existing.id = role.id || existing.id;
        }
      }
    }
  }

  for (const { source, doc } of sourceDocs) {
    for (const relation of doc.skillRelations) {
      const fromNormalized =
        sourceSkillToNormalized.get(`${source}:${relation.fromSkillId}`) || "";
      const toNormalized =
        sourceSkillToNormalized.get(`${source}:${relation.toSkillId}`) || "";
      if (!fromNormalized || !toNormalized || fromNormalized === toNormalized) continue;
      edges.push({
        from: fromNormalized,
        to: toNormalized,
        relationType: relation.relationType || "RELATED_TO",
        weight: relation.weight || 0.7,
        directed: relation.directed !== false,
        source,
      });
    }
  }

  const accepted = new Set<string>();
  const rejected = new Set<string>();
  for (const [normalized, skill] of skillByNormalized.entries()) {
    if (skill.classification === "accept") accepted.add(normalized);
    if (skill.classification === "reject") rejected.add(normalized);
  }

  let changed = true;
  while (changed) {
    changed = false;
    for (const edge of edges) {
      if (accepted.has(edge.from) && !accepted.has(edge.to) && !rejected.has(edge.to)) {
        accepted.add(edge.to);
        changed = true;
      }
      if (!edge.directed && accepted.has(edge.to) && !accepted.has(edge.from) && !rejected.has(edge.from)) {
        accepted.add(edge.from);
        changed = true;
      }
    }
  }

  function ensureAcceptedSkill(canonicalName: string): SkillAccumulator {
    const normalized = normalizeSkill(canonicalName);
    const existing = skillByNormalized.get(normalized);
    if (existing) {
      accepted.add(normalized);
      return existing;
    }
    const created: SkillAccumulator = {
      id: `generated-${toSlug(canonicalName)}`,
      normalizedName: normalized,
      displayName: canonicalName,
      category: "technology",
      source: "generated",
      sourceId: undefined,
      tags: new Set(["generated", "bridge"]),
      sources: new Set(["generated"]),
      qualityScore: SOURCE_QUALITY.generated,
      classification: "accept",
    };
    skillByNormalized.set(normalized, created);
    accepted.add(normalized);
    return created;
  }

  function ensureRole(canonicalTitle: string): RoleAccumulator {
    const normalized = normalizeSkill(canonicalTitle);
    const existing = roleByNormalized.get(normalized);
    if (existing) return existing;
    const created: RoleAccumulator = {
      id: buildFallbackRoleId(canonicalTitle),
      normalizedTitle: normalized,
      title: canonicalTitle,
      source: "generated",
      sources: new Set(["generated"]),
      qualityScore: 0.7,
    };
    roleByNormalized.set(normalized, created);
    return created;
  }

  const aliases: TaxonomyAliasNode[] = [];
  const aliasDedupe = new Set<string>();

  function addSkillAlias(aliasRaw: string, normalizedTarget: string, source: TaxonomySource, quality = 0.65): void {
    const alias = aliasRaw.trim();
    const normalizedAlias = normalizeSkill(alias);
    if (!alias || !normalizedAlias) return;
    const skill = skillByNormalized.get(normalizedTarget);
    if (!skill) return;
    if (!accepted.has(normalizedTarget)) return;

    const dedupeKey = `skill|${normalizedAlias}|${skill.id}`;
    if (aliasDedupe.has(dedupeKey)) return;
    aliasDedupe.add(dedupeKey);
    aliases.push({
      alias,
      skillId: skill.id,
      type: "skill",
      source,
      qualityScore: quality,
    });
  }

  function addRoleAlias(aliasRaw: string, normalizedRoleTitle: string, source: TaxonomySource, quality = 0.65): void {
    const alias = aliasRaw.trim();
    const normalizedAlias = normalizeSkill(alias);
    if (!alias || !normalizedAlias) return;
    const role = roleByNormalized.get(normalizedRoleTitle);
    if (!role) return;

    const dedupeKey = `role|${normalizedAlias}|${role.id}`;
    if (aliasDedupe.has(dedupeKey)) return;
    aliasDedupe.add(dedupeKey);
    aliases.push({
      alias,
      roleId: role.id,
      type: "role",
      source,
      qualityScore: quality,
    });
  }

  for (const { source, doc } of sourceDocs) {
    for (const alias of doc.aliases) {
      if (alias.type === "skill" && alias.skillId) {
        const normalizedTarget = sourceSkillToNormalized.get(`${source}:${alias.skillId}`) || "";
        if (!normalizedTarget) continue;
        addSkillAlias(alias.alias, normalizedTarget, source, alias.qualityScore || 0.6);
      } else if (alias.type === "role" && alias.roleId) {
        const normalizedRole = sourceRoleToNormalized.get(`${source}:${alias.roleId}`) || "";
        if (!normalizedRole) continue;
        addRoleAlias(alias.alias, normalizedRole, source, alias.qualityScore || 0.6);
      }
    }
  }

  for (const bridge of synonyms.skillAliases || []) {
    const canonical = ensureAcceptedSkill(bridge.canonical);
    addSkillAlias(bridge.alias, canonical.normalizedName, "generated", 0.7);
  }

  for (const bridge of synonyms.roleAliases || []) {
    const role = ensureRole(bridge.canonicalRole);
    addRoleAlias(bridge.alias, role.normalizedTitle, "generated", 0.7);
  }

  for (const term of synonyms.requiredTerms || []) {
    const normalized = normalizeSkill(term);
    const looksRole =
      normalized.includes("engineer") ||
      normalized.includes("developer") ||
      normalized.includes("manager") ||
      normalized.includes("analyst");

    if (looksRole) {
      const role = ensureRole(term);
      addRoleAlias(term, role.normalizedTitle, "generated", 0.75);
      continue;
    }

    const skill = ensureAcceptedSkill(term);
    addSkillAlias(term, skill.normalizedName, "generated", 0.75);
  }

  const roles: TaxonomyRoleNode[] = [];
  for (const role of roleByNormalized.values()) {
    const titleLower = role.title.toLowerCase();
    const looksTechRole =
      titleLower.includes("engineer") ||
      titleLower.includes("developer") ||
      titleLower.includes("devops") ||
      titleLower.includes("data") ||
      titleLower.includes("machine learning") ||
      titleLower.includes("software") ||
      titleLower.includes("platform");
    const looksBroadRole = BROAD_ROLE_KEYWORDS.some((keyword) => titleLower.includes(keyword));
    const shouldKeepRole =
      scope === "all"
        ? looksBroadRole || role.sources.has("curated") || role.sources.has("onet")
        : looksTechRole || role.sources.has("curated");
    if (!shouldKeepRole) continue;
    roles.push({
      id: role.id,
      title: role.title,
      source: role.source,
      sources: Array.from(role.sources),
      qualityScore: role.qualityScore,
    });
  }

  const roleIdSet = new Set(roles.map((role) => role.id));

  const roleRequirements: TaxonomyDocument["roleRequirements"] = [];
  const roleReqDedupe = new Set<string>();
  for (const { source, doc } of sourceDocs) {
    for (const req of doc.roleRequirements) {
      const normalizedRole = sourceRoleToNormalized.get(`${source}:${req.roleId}`) || "";
      const normalizedSkill = sourceSkillToNormalized.get(`${source}:${req.skillId}`) || "";
      if (!normalizedRole || !normalizedSkill) continue;
      if (!accepted.has(normalizedSkill)) continue;

      const role = roleByNormalized.get(normalizedRole);
      const skill = skillByNormalized.get(normalizedSkill);
      if (!role || !skill) continue;
      if (!roleIdSet.has(role.id)) continue;

      const reqKey = `${role.id}|${skill.id}`;
      if (roleReqDedupe.has(reqKey)) continue;
      roleReqDedupe.add(reqKey);
      roleRequirements.push({
        roleId: role.id,
        skillId: skill.id,
        weight: req.weight || 0.75,
        source,
      });
    }
  }

  const skills: TaxonomySkillNode[] = [];
  for (const normalized of accepted) {
    const skill = skillByNormalized.get(normalized);
    if (!skill) continue;
    skills.push({
      id: skill.id,
      name: skill.displayName,
      category: skill.category,
      source: skill.source,
      sourceId: skill.sourceId,
      tags: Array.from(skill.tags),
      qualityScore: Number(skill.qualityScore.toFixed(3)),
      sources: Array.from(skill.sources),
    });
  }

  const outputSkillIdByNormalized = new Map<string, string>();
  for (const skill of skills) {
    outputSkillIdByNormalized.set(normalizeSkill(skill.name), skill.id);
  }

  const skillRelations: TaxonomySkillRelation[] = [];
  const relationDedupe = new Set<string>();
  for (const edge of edges) {
    if (!accepted.has(edge.from) || !accepted.has(edge.to)) continue;
    const fromSkillId = outputSkillIdByNormalized.get(edge.from);
    const toSkillId = outputSkillIdByNormalized.get(edge.to);
    if (!fromSkillId || !toSkillId) continue;

    const relationKey = `${fromSkillId}|${toSkillId}|${edge.relationType}|${edge.directed}`;
    if (relationDedupe.has(relationKey)) continue;
    relationDedupe.add(relationKey);

    skillRelations.push({
      fromSkillId,
      toSkillId,
      relationType: edge.relationType,
      weight: edge.weight,
      directed: edge.directed,
      source: edge.source,
    });
  }

  const normalizedSkillNames = new Set(skills.map((skill) => normalizeSkill(skill.name)));
  const normalizedRoleTitles = new Set(roles.map((role) => normalizeSkill(role.title)));
  const normalizedAliases = new Set(
    aliases.map((alias) => normalizeSkill(alias.alias))
  );
  const requiredTermCoverage: Record<string, boolean> = {};
  for (const term of synonyms.requiredTerms || []) {
    const normalized = normalizeSkill(term);
    requiredTermCoverage[normalized] =
      normalizedSkillNames.has(normalized) ||
      normalizedRoleTitles.has(normalized) ||
      normalizedAliases.has(normalized);
  }

  const taxonomy: TaxonomyDocument = {
    version,
    domain: scope === "all" ? "recruiting-hybrid" : "tech-hybrid",
    generatedAt: new Date().toISOString(),
    sources: sourceDocs.map((sourceDoc) => sourceDoc.source),
    skills: sortByName(skills),
    roles: sortByName(roles),
    aliases: sortByName(aliases),
    roleRequirements: [...roleRequirements].sort((a, b) =>
      `${a.roleId}|${a.skillId}`.localeCompare(`${b.roleId}|${b.skillId}`)
    ),
    skillRelations: [...skillRelations].sort((a, b) =>
      `${a.fromSkillId}|${a.toSkillId}|${a.relationType}`.localeCompare(
        `${b.fromSkillId}|${b.toSkillId}|${b.relationType}`
      )
    ),
  };

  const report: TaxonomyBuildReport = {
    generatedAt: new Date().toISOString(),
    outputPath,
    input: {
      scope,
      curatedPath,
      escoPath,
      onetPath: onetPath || null,
      synonymsPath,
    },
    counts: {
      inputCuratedSkills: curated.skills.length,
      inputEscoSkills: esco.skills.length,
      inputOnetSkills: onet.skills.length,
      totalSourceSkills: skillByNormalized.size,
      acceptedSkills: taxonomy.skills.length,
      acceptedRoles: taxonomy.roles.length,
      acceptedAliases: taxonomy.aliases.length,
      acceptedRoleRequirements: taxonomy.roleRequirements.length,
      acceptedSkillRelations: taxonomy.skillRelations.length,
    },
    rejectReasons,
    requiredTermCoverage,
  };

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(taxonomy, null, 2), "utf8");
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), "utf8");

  console.log(
    `Tech taxonomy build complete. skills=${taxonomy.skills.length}, aliases=${taxonomy.aliases.length}, roles=${taxonomy.roles.length}, relations=${taxonomy.skillRelations.length}`
  );
  console.log(`Output: ${outputPath}`);
  console.log(`Report: ${reportPath}`);
}

main();
