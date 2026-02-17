import { asc } from "drizzle-orm";
import db from "@/db";
import { gfoCandidatesTable } from "@/db/schemas";
import { queueGraphSync } from "@/lib/graph/sync";

function getArg(flag: string, fallback = ""): string {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return fallback;
  return process.argv[idx + 1] || fallback;
}

async function main() {
  const limitRaw = getArg("--limit", "0");
  const limit = Number(limitRaw);
  const dryRun = process.argv.includes("--dry-run");

  const candidates = await db
    .select({ userId: gfoCandidatesTable.userId })
    .from(gfoCandidatesTable)
    .orderBy(asc(gfoCandidatesTable.createdAt));

  const target = Number.isFinite(limit) && limit > 0
    ? candidates.slice(0, limit)
    : candidates;

  if (dryRun) {
    console.log(`Dry run: would queue graph sync for ${target.length} candidates.`);
    return;
  }

  let queued = 0;
  for (const candidate of target) {
    await queueGraphSync({
      userId: candidate.userId,
      reason: "manual",
    });
    queued += 1;
  }

  console.log(`Queued graph sync jobs for ${queued} candidates.`);
}

main().catch((error) => {
  console.error("Failed to backfill skill index", error);
  process.exit(1);
});
