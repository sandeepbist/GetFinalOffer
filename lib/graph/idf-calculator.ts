import { count } from "drizzle-orm";
import db from "@/db";
import { gfoCandidatesTable } from "@/db/schemas";
import { GRAPH_IDF_MAX, GRAPH_IDF_MIN } from "@/lib/graph/scoring";
import { runCypherWrite } from "@/lib/graph/driver";
import { isGraphConfigured } from "@/lib/graph/config";

export async function refreshSkillIdfScores(): Promise<{
  totalCandidates: number;
  updatedSkills: number;
}> {
  if (!isGraphConfigured()) {
    return { totalCandidates: 0, updatedSkills: 0 };
  }

  const [{ total }] = await db
    .select({ total: count() })
    .from(gfoCandidatesTable);

  const totalCandidates = Number(total || 0);
  if (totalCandidates <= 0) {
    return { totalCandidates, updatedSkills: 0 };
  }

  const result = await runCypherWrite<{ updatedSkills: number }>(
    `
      MATCH (s:Skill)
      OPTIONAL MATCH (s)<-[:HAS_SKILL]-(:Candidate)
      WITH s, count(*) AS candidateCount, $totalCandidates AS n
      WITH s, candidateCount, n, log((toFloat(n) + 1.0) / (toFloat(candidateCount) + 1.0)) AS rawIdf
      SET s.candidateCount = candidateCount,
          s.idfScore = CASE
            WHEN rawIdf < $minIdf THEN $minIdf
            WHEN rawIdf > $maxIdf THEN $maxIdf
            ELSE rawIdf
          END,
          s.updatedAt = datetime()
      RETURN count(s) AS updatedSkills
    `,
    {
      totalCandidates,
      minIdf: GRAPH_IDF_MIN,
      maxIdf: GRAPH_IDF_MAX,
    }
  );

  return {
    totalCandidates,
    updatedSkills: Number(result[0]?.updatedSkills || 0),
  };
}
