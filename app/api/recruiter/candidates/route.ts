import { NextRequest, NextResponse } from "next/server";
import { eq, and, gte, isNull, desc, inArray } from "drizzle-orm";
import db from "@/db";
import { betterFetch } from "@better-fetch/fetch";
import {
  gfoRecruitersTable,
  gfoCandidateHiddenOrganisationsTable,
  gfoUserTable,
  gfoCandidatesTable,
  gfoCandidateSkillsTable,
  gfoSkillsLibraryTable,
} from "@/db/schemas";
import { generateEmbedding } from "@/lib/ai";
import { supabase } from "@/lib/supabase";
import type { CandidateSummaryDTO } from "@/features/recruiter/candidates-dto";
import { searchLimiter } from "@/lib/limiter";

export const dynamic = "force-dynamic";

const THRESHOLD_STRICT = 0.5;
const THRESHOLD_LOOSE = 0.25;

interface CandidateMatch {
  candidate_id: string;
  match_score: number;
  match_content: string;
}

async function getUserId(req: NextRequest): Promise<string> {
  const { data: session } = await betterFetch<{ user: { id: string } }>(
    "/api/auth/get-session",
    {
      baseURL: req.nextUrl.origin,
      headers: { cookie: req.headers.get("cookie") || "" },
    }
  );
  if (!session?.user?.id) throw new Error("Not authenticated");
  return session.user.id;
}

export async function GET(req: NextRequest) {
  let userId: string;
  try {
    userId = await getUserId(req);
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { success, limit, reset, remaining } = await searchLimiter.limit(
    userId
  );

  if (!success) {
    return NextResponse.json(
      { error: "Too many searches. Please wait a moment." },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
        },
      }
    );
  }

  const [recruiter] = await db
    .select({ organisationId: gfoRecruitersTable.organisationId })
    .from(gfoRecruitersTable)
    .where(eq(gfoRecruitersTable.userId, userId));

  if (!recruiter) {
    return NextResponse.json({ message: "Not a recruiter" }, { status: 403 });
  }
  const recruiterOrgId = recruiter.organisationId;

  const qp = req.nextUrl.searchParams;
  const search = qp.get("search") || undefined;
  const minYears = qp.get("minYears") ? parseInt(qp.get("minYears")!) : 0;
  const page = parseInt(qp.get("page") || "1");
  const pageSize = parseInt(qp.get("pageSize") || "10");

  let candidateIds: string[] = [];
  const matchScores: Record<string, number> = {};
  const matchHighlights: Record<string, string> = {};

  if (search) {
    try {
      const queryVector = await generateEmbedding(search);

      const runSearch = async (threshold: number) => {
        return await supabase.rpc("match_candidates_hybrid", {
          query_embedding: queryVector,
          query_text: search,
          match_threshold: threshold,
          match_count: pageSize * 2,
          min_experience: minYears,
          blocked_org_ids: [recruiterOrgId],
        });
      };

      const response = await runSearch(THRESHOLD_STRICT);
      let matches = (response.data as CandidateMatch[]) || [];

      if (response.error) {
        console.error("Strict Search RPC Error:", response.error);
        throw new Error("Search failed");
      }

      if (matches.length === 0) {
        const looseResponse = await runSearch(THRESHOLD_LOOSE);
        if (!looseResponse.error && looseResponse.data) {
          matches = looseResponse.data as CandidateMatch[];
        }
      }

      if (matches.length > 0) {
        candidateIds = matches.map((m) => m.candidate_id);
        matches.forEach((m) => {
          matchScores[m.candidate_id] = m.match_score;
          matchHighlights[m.candidate_id] = m.match_content;
        });
      } else {
        return NextResponse.json({ data: [], total: 0 });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      console.error("Search Error:", errorMessage);
      return NextResponse.json(
        { message: "Search service unavailable", error: errorMessage },
        { status: 500 }
      );
    }
  }

  const baseQuery = db
    .select({
      id: gfoUserTable.id,
      name: gfoUserTable.name,
      title: gfoCandidatesTable.professionalTitle,
      location: gfoCandidatesTable.location,
      yearsExperience: gfoCandidatesTable.yearsExperience,
      resumeUrl: gfoCandidatesTable.resumeUrl,
    })
    .from(gfoUserTable)
    .innerJoin(
      gfoCandidatesTable,
      eq(gfoCandidatesTable.userId, gfoUserTable.id)
    );

  const conditions = [
    search ? inArray(gfoCandidatesTable.userId, candidateIds) : undefined,
    !search && minYears
      ? gte(gfoCandidatesTable.yearsExperience, minYears)
      : undefined,
    !search ? isNull(gfoCandidateHiddenOrganisationsTable.id) : undefined,
  ].filter((c) => c !== undefined);

  let dataQuery = baseQuery.where(and(...conditions));

  if (!search) {
    dataQuery = dataQuery.leftJoin(
      gfoCandidateHiddenOrganisationsTable,
      and(
        eq(
          gfoCandidateHiddenOrganisationsTable.candidateUserId,
          gfoUserTable.id
        ),
        eq(gfoCandidateHiddenOrganisationsTable.organisationId, recruiterOrgId)
      )
    ) as typeof dataQuery;
  }

  const rows = await dataQuery
    .orderBy(desc(gfoCandidatesTable.createdAt))
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  const userIds = rows.map((r) => r.id);
  const skillsMap: Record<string, string[]> = {};

  if (userIds.length > 0) {
    const skillsRows = await db
      .select({
        userId: gfoCandidateSkillsTable.candidateUserId,
        name: gfoSkillsLibraryTable.name,
      })
      .from(gfoCandidateSkillsTable)
      .innerJoin(
        gfoSkillsLibraryTable,
        eq(gfoSkillsLibraryTable.id, gfoCandidateSkillsTable.skillId)
      )
      .where(inArray(gfoCandidateSkillsTable.candidateUserId, userIds));

    skillsRows.forEach((s) => {
      if (!skillsMap[s.userId]) skillsMap[s.userId] = [];
      skillsMap[s.userId].push(s.name);
    });
  }

  const results: CandidateSummaryDTO[] = rows.map((r) => {
    return {
      id: r.id,
      name: r.name,
      title: r.title ?? "Untitled",
      location: r.location,
      yearsExperience: r.yearsExperience,
      skills: skillsMap[r.id] || [],
      companyCleared: null,
      matchHighlight: matchHighlights[r.id] || undefined,
      matchScore: matchScores[r.id] || undefined,
    };
  });

  if (search) {
    results.sort((a, b) => (matchScores[b.id] || 0) - (matchScores[a.id] || 0));
  }

  return NextResponse.json({
    data: results,
    total: search ? results.length : 100,
  });
}
