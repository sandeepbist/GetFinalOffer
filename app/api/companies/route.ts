import { NextResponse } from "next/server";
import db from "@/db";
import { gfoCompaniesTable } from "@/db/schemas";
import type { InferModel } from "drizzle-orm";

export type CompanyDTO = InferModel<typeof gfoCompaniesTable, "select">;

export async function GET() {
  try {
    const companies = await db
      .select({
        id: gfoCompaniesTable.id,
        name: gfoCompaniesTable.name,
      })
      .from(gfoCompaniesTable);

    return NextResponse.json(companies, { status: 200 });
  } catch (err) {
    console.error("Error in GET /api/companies:", err);
    const errorMessage = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
