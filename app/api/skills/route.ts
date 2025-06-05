import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import db from "@/db";
import { gfoSkillsLibraryTable } from "@/db/schemas";
import type { InferModel } from "drizzle-orm";

export type SkillDTO = InferModel<typeof gfoSkillsLibraryTable, "select">;

export async function GET(req: NextRequest) {
  try {
    const skills = await db
      .select({
        id: gfoSkillsLibraryTable.id,
        name: gfoSkillsLibraryTable.name,
      })
      .from(gfoSkillsLibraryTable);

    return NextResponse.json(skills, { status: 200 });
  } catch (err: any) {
    console.error("Error in GET /api/skills:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
