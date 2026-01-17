import { NextResponse } from "next/server";
import db from "@/db";
import { gfoSkillsLibraryTable } from "@/db/schemas";
import type { InferModel } from "drizzle-orm";

export type SkillDTO = InferModel<typeof gfoSkillsLibraryTable, "select">;

export async function GET() {
  try {
    const skills = await db
      .select({
        id: gfoSkillsLibraryTable.id,
        name: gfoSkillsLibraryTable.name,
      })
      .from(gfoSkillsLibraryTable);

    return NextResponse.json(skills, { status: 200 });
  } catch (err) {
    console.error("Error in GET /api/skills:", err);
    const errorMessage = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
