import { runCypherRead } from "@/lib/graph/driver";
import { normalizeSkill } from "@/lib/graph/normalize-skill";

async function main() {
  const counts = await runCypherRead(
    `
    OPTIONAL MATCH (s:Skill) WITH count(s) AS skills
    OPTIONAL MATCH (r:Role) WITH skills, count(r) AS roles
    OPTIONAL MATCH (a:Alias) WITH skills, roles, count(a) AS aliases
    OPTIONAL MATCH ()-[e:RELATED_TO]->() WITH skills, roles, aliases, count(e) AS related
    OPTIONAL MATCH ()-[e:REQUIRES]->() WITH skills, roles, aliases, related, count(e) AS requires
    RETURN skills, roles, aliases, related, requires
    `,
    {}
  );
  console.log("\n=== Neo4j Data Counts ===");
  console.log(counts[0] || "No data found!");

  const testQueries = [
    "frontend engineer",
    "react",
    "javascript",
    "python",
    "machine learning",
    "css",
    "typescript",
    "node.js",
  ];

  console.log("\n=== Exact Match Test (normalizedName) ===");
  for (const q of testQueries) {
    const normalized = normalizeSkill(q);
    const result = await runCypherRead(
      `MATCH (s:Skill {normalizedName: $name}) RETURN s.name AS name, s.normalizedName AS normalized LIMIT 1`,
      { name: normalized }
    );
    console.log(
      `  "${q}" (-> "${normalized}"): ${
        result.length > 0 ? `[ok] Found: ${result[0].name}` : "[x] Not found"
      }`
    );
  }

  console.log("\n=== Contains Search (sampling) ===");
  for (const q of ["javascript", "react", "frontend", "python"]) {
    const result = await runCypherRead(
      `MATCH (s:Skill) WHERE toLower(s.normalizedName) CONTAINS $term RETURN s.normalizedName AS name LIMIT 5`,
      { term: q }
    );
    console.log(`  Contains "${q}": ${result.length > 0 ? result.map((r: any) => r.name).join(", ") : "none"}`);
  }

  console.log("\n=== Alias Search ===");
  for (const q of ["react", "javascript", "frontend"]) {
    const result = await runCypherRead(
      `MATCH (a:Alias) WHERE toLower(a.normalizedAlias) CONTAINS $term RETURN a.normalizedAlias AS alias LIMIT 5`,
      { term: q }
    );
    console.log(
      `  Alias contains "${q}": ${result.length > 0 ? result.map((r: any) => r.alias).join(", ") : "none"}`
    );
  }

  console.log("\n=== Sample Skills (first 20) ===");
  const sample = await runCypherRead(
    `MATCH (s:Skill) RETURN s.normalizedName AS name ORDER BY s.name LIMIT 20`,
    {}
  );
  for (const s of sample) {
    console.log(`  - ${s.name}`);
  }

  console.log("\n=== Sample Relations (first 10) ===");
  const rels = await runCypherRead(
    `MATCH (a:Skill)-[r:RELATED_TO]->(b:Skill) RETURN a.normalizedName AS from, b.normalizedName AS to, r.relationType AS type LIMIT 10`,
    {}
  );
  for (const r of rels) {
    console.log(`  ${r.from} -[${r.type}]-> ${r.to}`);
  }

  process.exit(0);
}

main().catch((error) => {
  console.error("Diagnosis failed:", error);
  process.exit(1);
});
