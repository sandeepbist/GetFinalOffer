import { NextRequest, NextResponse } from "next/server";
import { eq, and, like, gte, isNull, sql } from "drizzle-orm";
import db from "@/db";
import { betterFetch } from "@better-fetch/fetch";
import {
  gfoRecruitersTable,
  gfoCandidateHiddenOrganisationsTable,
  gfoUserTable,
  gfoCandidatesTable,
  gfoCandidateSkillsTable,
  gfoSkillsLibraryTable,
  gfoCandidateInterviewProgressTable,
  gfoCompaniesTable,
} from "@/db/schemas";
import type { CandidateSummaryDTO } from "@/features/recruiter/candidates-dto";

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
  const [rec] = await db
    .select({ organisationId: gfoRecruitersTable.organisationId })
    .from(gfoRecruitersTable)
    .where(eq(gfoRecruitersTable.userId, userId));
  if (!rec) {
    return NextResponse.json({ message: "Not a recruiter" }, { status: 403 });
  }
  const orgId = rec.organisationId;

  const qp = req.nextUrl.searchParams;
  const page = qp.get("page") ? +qp.get("page") : 1;
  const pageSize = qp.get("pageSize") ? +qp.get("pageSize") : 10;
  const search = qp.get("search") || undefined;
  const minYearsParam = qp.get("minYears");
  const minYears = minYearsParam ? +minYearsParam : undefined;
  const companyName = qp.get("company") || undefined;

  const baseFilters = [
    isNull(gfoCandidateHiddenOrganisationsTable.id),
    ...(search ? [like(gfoUserTable.name, `%${search}%`)] : []),
    ...(minYears ? [gte(gfoCandidatesTable.yearsExperience, minYears)] : []),
  ];

  let countQ = db
    .select({ count: sql<number>`COUNT(DISTINCT ${gfoUserTable.id})` })
    .from(gfoUserTable)
    .innerJoin(
      gfoCandidatesTable,
      eq(gfoCandidatesTable.userId, gfoUserTable.id)
    )
    .leftJoin(
      gfoCandidateHiddenOrganisationsTable,
      and(
        eq(
          gfoCandidateHiddenOrganisationsTable.candidateUserId,
          gfoUserTable.id
        ),
        eq(gfoCandidateHiddenOrganisationsTable.organisationId, orgId)
      )
    );

  if (companyName) {
    countQ = countQ
      .innerJoin(
        gfoCandidateInterviewProgressTable,
        eq(gfoCandidateInterviewProgressTable.candidateUserId, gfoUserTable.id)
      )
      .innerJoin(
        gfoCompaniesTable,
        eq(gfoCompaniesTable.id, gfoCandidateInterviewProgressTable.companyId)
      );
  }

  const [{ count: total }] = await countQ.where(
    and(
      ...baseFilters,
      ...(companyName ? [eq(gfoCompaniesTable.name, companyName)] : [])
    )
  );

  let dataQ = db
    .select({
      id: gfoUserTable.id,
      name: gfoUserTable.name,
      title: gfoCandidatesTable.professionalTitle,
      location: gfoCandidatesTable.location,
      yearsExperience: gfoCandidatesTable.yearsExperience,
      skills: sql<string[]>`
        array_remove(
          array_agg(DISTINCT ${gfoSkillsLibraryTable.name}),
        NULL
        )
      `,
      companyCleared: sql<string | null>`NULL`,
    })
    .from(gfoUserTable)
    .innerJoin(
      gfoCandidatesTable,
      eq(gfoCandidatesTable.userId, gfoUserTable.id)
    )
    .leftJoin(
      gfoCandidateHiddenOrganisationsTable,
      and(
        eq(
          gfoCandidateHiddenOrganisationsTable.candidateUserId,
          gfoUserTable.id
        ),
        eq(gfoCandidateHiddenOrganisationsTable.organisationId, orgId)
      )
    )
    .leftJoin(
      gfoCandidateSkillsTable,
      eq(gfoCandidateSkillsTable.candidateUserId, gfoUserTable.id)
    )
    .leftJoin(
      gfoSkillsLibraryTable,
      eq(gfoSkillsLibraryTable.id, gfoCandidateSkillsTable.skillId)
    );

  if (companyName) {
    dataQ = dataQ
      .innerJoin(
        gfoCandidateInterviewProgressTable,
        eq(gfoCandidateInterviewProgressTable.candidateUserId, gfoUserTable.id)
      )
      .innerJoin(
        gfoCompaniesTable,
        eq(gfoCompaniesTable.id, gfoCandidateInterviewProgressTable.companyId)
      );
  }

  const rows = await dataQ
    .where(
      and(
        ...baseFilters,
        ...(companyName ? [eq(gfoCompaniesTable.name, companyName)] : [])
      )
    )
    .groupBy(
      gfoUserTable.id,
      gfoUserTable.name,
      gfoCandidatesTable.professionalTitle,
      gfoCandidatesTable.location,
      gfoCandidatesTable.yearsExperience
    )
    .offset((page - 1) * pageSize)
    .limit(pageSize);

  const data: CandidateSummaryDTO[] = rows.map((r) => ({
    id: r.id,
    name: r.name,
    title: r.title ?? "",
    location: r.location,
    yearsExperience: r.yearsExperience,
    skills: r.skills,
    companyCleared: null,
  }));

  return NextResponse.json({ data, total });
}
