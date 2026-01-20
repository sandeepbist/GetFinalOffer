import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import db from "@/db";
import { gfoSkillsLibraryTable } from "@/db/schemas";

const getCachedSkills = unstable_cache(
  async () => {
    return await db
      .select({
        id: gfoSkillsLibraryTable.id,
        name: gfoSkillsLibraryTable.name,
      })
      .from(gfoSkillsLibraryTable);
  },
  ["all-skills-list"],
  {
    revalidate: 60 * 60 * 24,
    tags: ["skills"],
  }
);

export async function GET() {
  try {
    const skills = await getCachedSkills();

    return NextResponse.json(skills, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (err) {
    console.error("Error in GET /api/skills:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}