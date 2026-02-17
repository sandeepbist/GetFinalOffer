import { eq } from "drizzle-orm";
import db from "@/db";
import { gfoSkillRelationshipProposalsTable } from "@/db/schemas";

const TRUSTED_SOURCE_BOOST: Record<string, number> = {
  esco: 0.15,
  onet: 0.12,
  taxonomy: 0.2,
};

function computeProposalScore(confidence: number, source: string): number {
  const base = Math.max(0, Math.min(1, confidence));
  const sourceBoost = TRUSTED_SOURCE_BOOST[source] || 0;
  return Math.min(1, base + sourceBoost);
}

export async function rankGraphProposalsProcessor(batchSize = 200): Promise<{
  processed: number;
}> {
  const rows = await db
    .select({
      id: gfoSkillRelationshipProposalsTable.id,
      confidence: gfoSkillRelationshipProposalsTable.confidence,
      source: gfoSkillRelationshipProposalsTable.source,
    })
    .from(gfoSkillRelationshipProposalsTable)
    .where(eq(gfoSkillRelationshipProposalsTable.reviewStatus, "pending"))
    .limit(batchSize);

  const chunkSize = 25;
  const now = new Date();

  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize);
    await Promise.all(
      chunk.map(async (row) => {
        const score = computeProposalScore(row.confidence, row.source);
        await db
          .update(gfoSkillRelationshipProposalsTable)
          .set({
            proposalScore: score,
            updatedAt: now,
          })
          .where(eq(gfoSkillRelationshipProposalsTable.id, row.id));
      })
    );
  }

  return { processed: rows.length };
}
