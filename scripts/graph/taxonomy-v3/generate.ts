/**
 * GetFinalOffer — Taxonomy v3 Main Orchestrator & Generator
 *
 * Combines all specialized domain modules into a single, high-fidelity,
 * 10,000+ node skill taxonomy graph.
 */

import fs from "fs";
import path from "path";
import { normalizeSkill } from "@/lib/graph/normalize-skill";
import type {
  TaxonomyDocument,
  TaxonomySkillNode,
  TaxonomyRoleNode,
  TaxonomyAliasNode,
  TaxonomyRoleRequirement,
  TaxonomySkillRelation,
} from "@/scripts/graph/taxonomy-types";
import { validateTaxonomyDocument } from "@/scripts/graph/validate-taxonomy";

// Domain imports
import { LANGUAGES } from "./domains/languages";
import { FRONTEND } from "./domains/frontend";
import { BACKEND } from "./domains/backend";
import { DATABASES } from "./domains/databases";
import { CLOUD } from "./domains/cloud";
import { DEVOPS } from "./domains/devops";
import { DATA_ENGINEERING } from "./domains/data-engineering";
import { ML_AI } from "./domains/ml-ai";
import { SECURITY } from "./domains/security";
import { MOBILE } from "./domains/mobile";
import { TESTING } from "./domains/testing";
import { BLOCKCHAIN } from "./domains/blockchain";
import { DESIGN } from "./domains/design";
import { PRODUCT_MANAGEMENT } from "./domains/product-management";
import { SYSTEMS_EMBEDDED } from "./domains/systems-embedded";
import { ENTERPRISE_FINTECH } from "./domains/enterprise-fintech";
import { ARCHITECTURE_PATTERNS } from "./domains/architecture-patterns";
import { TOOLS_PRACTICES } from "./domains/tools-practices";

import { ROLES } from "./roles";
import { RELATIONS } from "./relations";
import type { SkillDef } from "./types";

export const ALL_DOMAINS: SkillDef[] = [
  ...LANGUAGES,
  ...FRONTEND,
  ...BACKEND,
  ...DATABASES,
  ...CLOUD,
  ...DEVOPS,
  ...DATA_ENGINEERING,
  ...ML_AI,
  ...SECURITY,
  ...MOBILE,
  ...TESTING,
  ...BLOCKCHAIN,
  ...DESIGN,
  ...PRODUCT_MANAGEMENT,
  ...SYSTEMS_EMBEDDED,
  ...ENTERPRISE_FINTECH,
  ...ARCHITECTURE_PATTERNS,
  ...TOOLS_PRACTICES,
];

export function generateTaxonomyV3(): TaxonomyDocument {
  // Deduplicate skills by ID
  const skillById = new Map<string, SkillDef>();
  const skillByNormalized = new Map<string, SkillDef>();

  for (const s of ALL_DOMAINS) {
    if (skillById.has(s.id)) {
      continue;
    }
    const norm = normalizeSkill(s.name);
    skillById.set(s.id, s);
    skillByNormalized.set(norm, s);
  }

  const skillsList = Array.from(skillById.values());
  const skillIdSet = new Set(skillsList.map((s) => s.id));

  // Build skills
  const skills: TaxonomySkillNode[] = skillsList.map((s) => ({
    id: s.id,
    name: s.name,
    category: s.category,
    source: "curated",
    tags: s.tags || [],
    qualityScore: 0.95,
    sources: ["curated"],
  }));

  // Build roles
  const roles: TaxonomyRoleNode[] = ROLES.map((r) => ({
    id: r.id,
    title: r.title,
    source: "curated",
    tags: r.tags || [],
    qualityScore: 0.95,
    sources: ["curated"],
  }));
  const roleIdSet = new Set(roles.map((r) => r.id));

  // Build aliases (from skills + generated recruiter search variations)
  const aliases: TaxonomyAliasNode[] = [];
  const aliasDedupe = new Set<string>();

  function addSkillAlias(aliasText: string, skillId: string, quality = 0.9) {
    const raw = aliasText.trim();
    if (!raw) return;
    const norm = normalizeSkill(raw);
    if (!norm) return;
    const key = `skill|${norm}|${skillId}`;
    if (aliasDedupe.has(key)) return;
    aliasDedupe.add(key);
    aliases.push({
      alias: raw,
      skillId,
      type: "skill",
      source: "curated",
      qualityScore: quality,
    });
  }

  function addRoleAlias(aliasText: string, roleId: string, quality = 0.9) {
    const raw = aliasText.trim();
    if (!raw) return;
    const norm = normalizeSkill(raw);
    if (!norm) return;
    const key = `role|${norm}|${roleId}`;
    if (aliasDedupe.has(key)) return;
    aliasDedupe.add(key);
    aliases.push({
      alias: raw,
      roleId,
      type: "role",
      source: "curated",
      qualityScore: quality,
    });
  }

  for (const skill of skillsList) {
    // Add explicitly defined aliases
    if (skill.aliases) {
      for (const a of skill.aliases) {
        addSkillAlias(a, skill.id, 0.92);
      }
    }

    // Add smart recruiter keyword patterns
    const name = skill.name;
    addSkillAlias(`${name} development`, skill.id, 0.85);
    addSkillAlias(`${name} developer`, skill.id, 0.85);
    addSkillAlias(`${name} engineer`, skill.id, 0.85);
    addSkillAlias(`${name} engineering`, skill.id, 0.85);
    addSkillAlias(`${name} specialist`, skill.id, 0.8);
    addSkillAlias(`${name} architecture`, skill.id, 0.8);
    addSkillAlias(`${name} programming`, skill.id, 0.85);
    addSkillAlias(`proficient in ${name}`, skill.id, 0.8);
    addSkillAlias(`experience with ${name}`, skill.id, 0.8);
    addSkillAlias(`${name} expert`, skill.id, 0.8);
  }

  for (const role of ROLES) {
    if (role.aliases) {
      for (const a of role.aliases) {
        addRoleAlias(a, role.id, 0.95);
      }
    }
    // Seniority expansions for roles
    const title = role.title;
    addRoleAlias(`Junior ${title}`, role.id, 0.9);
    addRoleAlias(`Mid-Level ${title}`, role.id, 0.9);
    addRoleAlias(`Senior ${title}`, role.id, 0.95);
    addRoleAlias(`Lead ${title}`, role.id, 0.95);
    addRoleAlias(`Staff ${title}`, role.id, 0.9);
    addRoleAlias(`Principal ${title}`, role.id, 0.9);
    addRoleAlias(`Head of ${title}`, role.id, 0.85);
    addRoleAlias(`${title} II`, role.id, 0.9);
    addRoleAlias(`${title} III`, role.id, 0.9);
    addRoleAlias(`${title} (Remote)`, role.id, 0.9);
  }

  // Build role requirements
  const roleRequirements: TaxonomyRoleRequirement[] = [];
  const reqDedupe = new Set<string>();

  for (const role of ROLES) {
    for (const r of role.skills) {
      if (!skillIdSet.has(r.skillId)) {
        console.warn(`[WARN] Role "${role.title}" references missing skill "${r.skillId}"`);
        continue;
      }
      const key = `${role.id}|${r.skillId}`;
      if (reqDedupe.has(key)) continue;
      reqDedupe.add(key);
      roleRequirements.push({
        roleId: role.id,
        skillId: r.skillId,
        weight: r.weight,
        source: "curated",
      });
    }
  }

  // Build skill relations
  const skillRelations: TaxonomySkillRelation[] = [];
  const relDedupe = new Set<string>();

  for (const rel of RELATIONS) {
    if (!skillIdSet.has(rel.from) || !skillIdSet.has(rel.to)) {
      if (!skillIdSet.has(rel.from)) console.warn(`[WARN] Relation references missing skill "${rel.from}"`);
      if (!skillIdSet.has(rel.to)) console.warn(`[WARN] Relation references missing skill "${rel.to}"`);
      continue;
    }
    const directed = rel.directed !== false;
    const key = `${rel.from}|${rel.to}|${rel.type}`;
    if (relDedupe.has(key)) continue;
    relDedupe.add(key);
    skillRelations.push({
      fromSkillId: rel.from,
      toSkillId: rel.to,
      relationType: rel.type,
      weight: rel.weight,
      directed,
      source: "curated",
    });
  }

  // Auto-connect category clusters
  const categoryMap = new Map<string, string[]>();
  for (const skill of skillsList) {
    const list = categoryMap.get(skill.category) || [];
    list.push(skill.id);
    categoryMap.set(skill.category, list);
  }

  const AUTO_LINK_CATEGORIES = new Set([
    "language", "frontend-framework", "backend-framework", "database-rdbms",
    "database-nosql", "database-vector", "cloud-compute", "cloud-storage",
    "containerization", "monitoring", "cicd", "dl-framework", "ml-library",
    "genai-framework", "mobile-ui-framework", "unit-testing", "test-automation",
    "design-tool", "service-mesh",
  ]);

  for (const [category, ids] of categoryMap.entries()) {
    if (!AUTO_LINK_CATEGORIES.has(category)) continue;
    if (ids.length < 2 || ids.length > 20) continue;

    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const key1 = `${ids[i]}|${ids[j]}|RELATED_TO`;
        const key2 = `${ids[j]}|${ids[i]}|RELATED_TO`;
        if (relDedupe.has(key1) || relDedupe.has(key2)) continue;

        // Skip if already has alternative edge
        const alt1 = `${ids[i]}|${ids[j]}|ALTERNATIVE_TO`;
        const alt2 = `${ids[j]}|${ids[i]}|ALTERNATIVE_TO`;
        if (relDedupe.has(alt1) || relDedupe.has(alt2)) continue;

        relDedupe.add(key1);
        skillRelations.push({
          fromSkillId: ids[i],
          toSkillId: ids[j],
          relationType: "RELATED_TO",
          weight: 0.65,
          directed: false,
          source: "generated",
        });
      }
    }
  }

  const totalNodes = skills.length + roles.length + aliases.length;
  const totalEdges = skillRelations.length + roleRequirements.length;

  console.log(`\n===================================================`);
  console.log(`🚀 GetFinalOffer — Taxonomy v3 Generation Summary`);
  console.log(`===================================================`);
  console.log(`Skills (nodes):           ${skills.length.toLocaleString()}`);
  console.log(`Roles (nodes):            ${roles.length.toLocaleString()}`);
  console.log(`Aliases (nodes):          ${aliases.length.toLocaleString()}`);
  console.log(`───────────────────────────────────────────────────`);
  console.log(`TOTAL NODES:              ${totalNodes.toLocaleString()}`);
  console.log(`───────────────────────────────────────────────────`);
  console.log(`Skill Relations (edges):  ${skillRelations.length.toLocaleString()}`);
  console.log(`Role Requirements (edges):${roleRequirements.length.toLocaleString()}`);
  console.log(`TOTAL EDGES:              ${totalEdges.toLocaleString()}`);
  console.log(`===================================================\n`);

  return {
    version: 3,
    domain: "ai-tech-recruitment",
    generatedAt: new Date().toISOString(),
    sources: ["curated", "generated"],
    skills: skills.sort((a, b) => a.name.localeCompare(b.name)),
    roles: roles.sort((a, b) => a.title.localeCompare(b.title)),
    aliases: aliases.sort((a, b) => (a.alias || "").localeCompare(b.alias || "")),
    roleRequirements: roleRequirements.sort((a, b) =>
      `${a.roleId}|${a.skillId}`.localeCompare(`${b.roleId}|${b.skillId}`)
    ),
    skillRelations: skillRelations.sort((a, b) =>
      `${a.fromSkillId}|${a.toSkillId}`.localeCompare(`${b.fromSkillId}|${b.toSkillId}`)
    ),
  };
}

export function main() {
  const outputPath = path.resolve(
    process.cwd(),
    process.argv[2] || "data/skill-graph/taxonomy.v3.json"
  );

  const doc = generateTaxonomyV3();

  // Run comprehensive validation on the generated taxonomy
  console.log("Validating generated taxonomy against graph constraints...");
  const errors = validateTaxonomyDocument(doc);
  if (errors.length > 0) {
    console.error("❌ Taxonomy validation failed with errors:");
    errors.forEach((err) => console.error(` - ${err}`));
    process.exit(1);
  }
  console.log("✅ Taxonomy validation passed with 0 errors.");

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(doc, null, 2), "utf8");

  console.log(`\n🎉 Taxonomy saved to: ${outputPath}`);
}

const isDirectRun = (process.argv[1] || "").toLowerCase().includes("generate");
if (isDirectRun) {
  main();
}
