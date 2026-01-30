import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import db from "@/db";
import { gfoCompaniesTable } from "@/db/schemas";

const getCachedCompanies = unstable_cache(
  async () => {
    return await db
      .select({
        id: gfoCompaniesTable.id,
        name: gfoCompaniesTable.name,
      })
      .from(gfoCompaniesTable);
  },
  ["all-companies-list"],
  {
    revalidate: 60 * 60 * 24,
    tags: ["companies"],
  }
);

export async function GET() {
  try {
    const companies = await getCachedCompanies();

    return NextResponse.json(companies, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (err) {
    console.error("Error in GET /api/companies:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}