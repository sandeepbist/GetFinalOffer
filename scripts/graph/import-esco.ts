import fs from "fs";
import path from "path";
import { normalizeSkill } from "@/lib/graph/normalize-skill";
import { parseCsvFile } from "@/scripts/graph/csv";
import type {
  BuildRejectBreakdown,
  TaxonomyAliasNode,
  TaxonomyDocument,
  TaxonomySkillNode,
  TaxonomySkillRelation,
} from "@/scripts/graph/taxonomy-types";

interface RelationDefaults {
  sourceId: string;
  targetId: string;
  broaderId: string;
  narrowerId: string;
}

interface MappedRelation extends TaxonomySkillRelation {
  fromSkillId: string;
  toSkillId: string;
}

interface EscoImportReport {
  generatedAt: string;
  input: {
    skillsPath: string;
    relationsPath: string;
  };
  output: {
    taxonomyPath: string;
    reportPath: string;
  };
  counts: Record<string, number>;
  rejectReasons: BuildRejectBreakdown;
}

function getArg(flag: string, fallback = ""): string {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return fallback;
  return process.argv[idx + 1] || fallback;
}

function toAbsPath(inputPath: string): string {
  return path.resolve(process.cwd(), inputPath);
}

function incrementReason(breakdown: BuildRejectBreakdown, reason: string): void {
  breakdown[reason] = (breakdown[reason] || 0) + 1;
}

function sanitizeText(input: string): string {
  return input.replace(/\u0000/g, "").replace(/\s+/g, " ").trim();
}

function extractId(raw: string): string {
  const cleaned = sanitizeText(raw).split("?")[0];
  if (!cleaned) return "";
  const parts = cleaned.split(/[\\/#]/g).filter(Boolean);
  const tail = parts[parts.length - 1] || cleaned;
  return tail.toLowerCase().trim();
}

function isLikelyMalformedId(id: string): boolean {
  if (!id) return true;
  if (id.length < 2 || id.length > 160) return true;
  if (!/^[a-z0-9][a-z0-9._:-]*$/i.test(id)) return true;
  return false;
}

function splitAliases(raw: string): string[] {
  return raw
    .split(/[|\n;]/g)
    .map((alias) => sanitizeText(alias))
    .filter((alias) => alias.length > 1 && alias.length <= 120);
}

function mapEscoRelation(
  row: Record<string, string>,
  defaults: RelationDefaults
): MappedRelation | null {
  let relationRaw = (
    row.relationType ||
    row.relationshipType ||
    row.relation ||
    row.type ||
    row.predicate ||
    ""
  ).toLowerCase();

  if (!relationRaw && (row.broaderUri || row.broaderConceptUri)) {
    relationRaw = "broader";
  }

  const { sourceId, targetId, broaderId, narrowerId } = defaults;

  if (relationRaw.includes("broader")) {
    const parent = broaderId || sourceId || targetId;
    const child = narrowerId || (parent === sourceId ? targetId : sourceId);
    if (!parent || !child) return null;
    return {
      fromSkillId: parent,
      toSkillId: child,
      relationType: "PARENT_OF",
      weight: 0.9,
      directed: true,
      source: "esco",
    };
  }

  if (relationRaw.includes("narrower")) {
    const child = narrowerId || sourceId || targetId;
    const parent = broaderId || (child === sourceId ? targetId : sourceId);
    if (!parent || !child) return null;
    return {
      fromSkillId: child,
      toSkillId: parent,
      relationType: "CHILD_OF",
      weight: 0.9,
      directed: true,
      source: "esco",
    };
  }

  if (relationRaw.includes("essential")) {
    if (!sourceId || !targetId) return null;
    return {
      fromSkillId: sourceId,
      toSkillId: targetId,
      relationType: "REQUIRES",
      weight: 0.85,
      directed: true,
      source: "esco",
    };
  }

  if (!sourceId || !targetId) return null;

  return {
    fromSkillId: sourceId,
    toSkillId: targetId,
    relationType: "RELATED_TO",
    weight: 0.8,
    directed: true,
    source: "esco",
  };
}

function main() {
  const skillsPath = getArg("--skills");
  const relationsPath = getArg("--relations");
  const outputPath = getArg(
    "--output",
    path.resolve(process.cwd(), "data/skill-graph/taxonomy.v1.esco.json")
  );
  const reportPath = getArg(
    "--report",
    path.resolve(process.cwd(), "data/skill-graph/reports/esco-import-report.json")
  );
  const version = Number(getArg("--version", "1")) || 1;

  if (!skillsPath || !relationsPath) {
    console.error(
      "Usage: tsx scripts/graph/import-esco.ts --skills <skills.csv> --relations <relations.csv> [--output <path>] [--report <path>] [--version <n>]"
    );
    process.exit(1);
  }

  const skillRows = parseCsvFile(toAbsPath(skillsPath));
  const relationRows = parseCsvFile(toAbsPath(relationsPath));

  const report: EscoImportReport = {
    generatedAt: new Date().toISOString(),
    input: {
      skillsPath: toAbsPath(skillsPath),
      relationsPath: toAbsPath(relationsPath),
    },
    output: {
      taxonomyPath: outputPath,
      reportPath,
    },
    counts: {
      inputSkillRows: skillRows.length,
      acceptedSkills: 0,
      rejectedSkillRows: 0,
      duplicateSkillRowsMerged: 0,
      acceptedAliases: 0,
      rejectedAliases: 0,
      duplicateAliasesMerged: 0,
      inputRelationRows: relationRows.length,
      acceptedRelations: 0,
      rejectedRelationRows: 0,
      duplicateRelationsMerged: 0,
    },
    rejectReasons: {},
  };

  const skills: TaxonomySkillNode[] = [];
  const aliases: TaxonomyAliasNode[] = [];
  const canonicalSkillByNormalized = new Map<string, TaxonomySkillNode>();
  const canonicalByRawId = new Map<string, string>();
  const aliasDedupe = new Set<string>();

  for (const row of skillRows) {
    const rawId = extractId(
      row.conceptUri ||
        row.skillUri ||
        row.id ||
        row.identifier ||
        ""
    );
    const rawName =
      row.preferredLabel ||
      row["preferredLabel@en"] ||
      row.label ||
      "";

    if (!rawId) {
      report.counts.rejectedSkillRows += 1;
      incrementReason(report.rejectReasons, "missing_skill_id");
      continue;
    }

    if (isLikelyMalformedId(rawId)) {
      report.counts.rejectedSkillRows += 1;
      incrementReason(report.rejectReasons, "malformed_skill_id");
      continue;
    }

    const name = sanitizeText(rawName);
    if (!name) {
      report.counts.rejectedSkillRows += 1;
      incrementReason(report.rejectReasons, "missing_skill_name");
      continue;
    }

    const normalizedName = normalizeSkill(name);
    if (!normalizedName) {
      report.counts.rejectedSkillRows += 1;
      incrementReason(report.rejectReasons, "empty_normalized_skill_name");
      continue;
    }

    let canonical = canonicalSkillByNormalized.get(normalizedName);
    if (!canonical) {
      canonical = {
        id: rawId,
        name,
        category: row.skillType || row.category || "skill",
        source: "esco",
        sourceId: rawId,
        qualityScore: 0.65,
        tags: [row.skillType || row.category || "skill"],
        sources: ["esco"],
      };
      canonicalSkillByNormalized.set(normalizedName, canonical);
      skills.push(canonical);
      report.counts.acceptedSkills += 1;
    } else {
      report.counts.duplicateSkillRowsMerged += 1;
    }
    canonicalByRawId.set(rawId, canonical.id);

    const altLabelRaw =
      row.altLabels ||
      row["altLabels@en"] ||
      row.altLabel ||
      "";

    const altLabels = splitAliases(altLabelRaw);
    for (const aliasRaw of altLabels) {
      const alias = sanitizeText(aliasRaw);
      const normalizedAlias = normalizeSkill(alias);
      if (!normalizedAlias || normalizedAlias === normalizedName) {
        report.counts.rejectedAliases += 1;
        incrementReason(report.rejectReasons, "invalid_alias");
        continue;
      }

      const aliasKey = `${normalizedAlias}|${canonical.id}`;
      if (aliasDedupe.has(aliasKey)) {
        report.counts.duplicateAliasesMerged += 1;
        continue;
      }
      aliasDedupe.add(aliasKey);

      aliases.push({
        alias,
        skillId: canonical.id,
        type: "skill",
        source: "esco",
        qualityScore: 0.6,
      });
      report.counts.acceptedAliases += 1;
    }
  }

  const skillRelations: TaxonomySkillRelation[] = [];
  const seenRelations = new Set<string>();
  const skillIdSet = new Set(skills.map((skill) => skill.id));
  for (const row of relationRows) {
    const sourceId = extractId(
      row.conceptUri ||
        row.fromConceptUri ||
        row.sourceConceptUri ||
        row.narrowerConceptUri ||
        row.from ||
        ""
    );
    const targetId = extractId(
      row.broaderUri ||
        row.toConceptUri ||
        row.targetConceptUri ||
        row.broaderConceptUri ||
        row.to ||
        ""
    );
    const broaderId = extractId(
      row.broaderUri ||
        row.broaderConceptUri ||
        row.broaderSkillConceptUri ||
        row.broaderSkillUri ||
        ""
    );
    const narrowerId = extractId(
      row.conceptUri ||
        row.narrowerConceptUri ||
        row.narrowerSkillConceptUri ||
        row.narrowerSkillUri ||
        ""
    );

    if (!sourceId || !targetId) {
      report.counts.rejectedRelationRows += 1;
      incrementReason(report.rejectReasons, "relation_missing_endpoints");
      continue;
    }

    const mapped = mapEscoRelation(row, {
      sourceId,
      targetId,
      broaderId,
      narrowerId,
    });

    if (!mapped) {
      report.counts.rejectedRelationRows += 1;
      incrementReason(report.rejectReasons, "relation_unmappable");
      continue;
    }

    const fromCanonical = canonicalByRawId.get(mapped.fromSkillId) || mapped.fromSkillId;
    const toCanonical = canonicalByRawId.get(mapped.toSkillId) || mapped.toSkillId;

    if (!skillIdSet.has(fromCanonical) || !skillIdSet.has(toCanonical)) {
      report.counts.rejectedRelationRows += 1;
      incrementReason(report.rejectReasons, "relation_missing_skill_after_merge");
      continue;
    }

    const relationKey = `${fromCanonical}|${toCanonical}|${mapped.relationType}`;
    if (seenRelations.has(relationKey)) {
      report.counts.duplicateRelationsMerged += 1;
      continue;
    }
    seenRelations.add(relationKey);

    skillRelations.push({
      ...mapped,
      fromSkillId: fromCanonical,
      toSkillId: toCanonical,
    });
    report.counts.acceptedRelations += 1;
  }

  const taxonomy: TaxonomyDocument = {
    version,
    domain: "esco",
    generatedAt: new Date().toISOString(),
    sources: ["esco"],
    skills,
    roles: [],
    aliases,
    roleRequirements: [],
    skillRelations,
  };

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(taxonomy, null, 2), "utf8");
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), "utf8");

  console.log(
    `ESCO import complete. skills=${skills.length}, relations=${skillRelations.length}, aliases=${aliases.length}`
  );
  console.log(`Output: ${outputPath}`);
  console.log(`Report: ${reportPath}`);
}

main();
