import fs from "fs";
import path from "path";

interface TaxonomyRelation {
  fromSkillId: string;
  toSkillId: string;
  relationType: string;
  weight: number;
  directed?: boolean;
}

interface TaxonomyGraph {
  skillRelations: TaxonomyRelation[];
}

function getAdjacency(graph: TaxonomyGraph): Map<string, string[]> {
  const adjacency = new Map<string, string[]>();

  for (const edge of graph.skillRelations) {
    if (!edge.directed) continue;
    const list = adjacency.get(edge.fromSkillId) ?? [];
    list.push(edge.toSkillId);
    adjacency.set(edge.fromSkillId, list);
  }

  return adjacency;
}

export function detectDirectionalCycles(graph: TaxonomyGraph): string[] {
  const adjacency = getAdjacency(graph);
  const visited = new Set<string>();
  const stack = new Set<string>();
  const pathStack: string[] = [];
  const cycles: string[] = [];

  const walk = (node: string): void => {
    visited.add(node);
    stack.add(node);
    pathStack.push(node);

    const neighbors = adjacency.get(node) ?? [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        walk(neighbor);
        continue;
      }
      if (stack.has(neighbor)) {
        const start = pathStack.indexOf(neighbor);
        const cyclePath = [...pathStack.slice(start), neighbor].join(" -> ");
        cycles.push(cyclePath);
      }
    }

    pathStack.pop();
    stack.delete(node);
  };

  const nodes = new Set<string>();
  for (const edge of graph.skillRelations) {
    nodes.add(edge.fromSkillId);
    nodes.add(edge.toSkillId);
  }

  for (const node of nodes) {
    if (!visited.has(node)) {
      walk(node);
    }
  }

  return cycles;
}

const isDirectRun = (process.argv[1] || "").toLowerCase().includes("detect-cycles");
if (isDirectRun) {
  const filePath =
    process.argv[2] ||
    path.resolve(process.cwd(), "data/skill-graph/taxonomy.v1.json");
  const taxonomy = JSON.parse(fs.readFileSync(filePath, "utf8")) as TaxonomyGraph;
  const cycles = detectDirectionalCycles(taxonomy);

  if (cycles.length === 0) {
    console.log("No directional cycles detected.");
    process.exit(0);
  }

  console.error("Directional cycles detected:");
  for (const cycle of cycles) {
    console.error(` - ${cycle}`);
  }
  process.exit(1);
}
