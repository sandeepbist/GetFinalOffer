import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import db from "@/db";
import { gfoCompaniesTable } from "@/db/schemas";
import type { InferModel } from "drizzle-orm";

export type CompanyDTO = InferModel<typeof gfoCompaniesTable, "select">;

export async function GET(req: NextRequest) {
  try {
    const companies = await db
      .select({
        id: gfoCompaniesTable.id,
        name: gfoCompaniesTable.name,
      })
      .from(gfoCompaniesTable);

    return NextResponse.json(companies, { status: 200 });
  } catch (err: any) {
    console.error("Error in GET /api/companies:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
