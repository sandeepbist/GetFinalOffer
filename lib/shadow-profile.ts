import db from "@/db";
import { gfoCandidatesTable } from "@/db/schemas";
import { eq } from "drizzle-orm";
import { redis } from "@/lib/redis";

export async function syncShadowProfile(userId: string): Promise<void> {
    const [candidate] = await db
        .select({
            yearsExperience: gfoCandidatesTable.yearsExperience,
            location: gfoCandidatesTable.location,
            professionalTitle: gfoCandidatesTable.professionalTitle,
        })
        .from(gfoCandidatesTable)
        .where(eq(gfoCandidatesTable.userId, userId));

    if (!candidate) return;

    const shadowKey = `candidate:shadow:${userId}`;

    await redis.hset(shadowKey, {
        exp: candidate.yearsExperience,
        loc: candidate.location.toLowerCase(),
        role: candidate.professionalTitle?.toLowerCase() || "",
        indexedAt: Date.now()
    });

    await redis.expire(shadowKey, 60 * 60 * 24 * 30);

    console.log(`[ShadowSync] Updated shadow profile for ${userId}`);
}
