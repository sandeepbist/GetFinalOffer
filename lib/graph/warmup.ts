import { sql } from "drizzle-orm";
import db from "@/db";
import { expandSkillsFromGraph } from "@/lib/graph/expansion-service";

interface QueryRow {
  query: string | null;
}

const FALLBACK_QUERIES = [
  "Machine Learning Engineer",
  "Full Stack Developer",
  "Data Engineer",
  "DevOps Engineer",
  "Frontend Engineer",
  "Backend Engineer",
  "NLP Engineer",
  "Platform Engineer",
];

export async function loadTopWarmupQueries(limit = 100): Promise<string[]> {
  const result = await db.execute(sql<QueryRow>`
    SELECT metadata ->> 'query' AS query
    FROM gfo_search_logs
    WHERE event_type = 'SEARCH'
      AND created_at >= NOW() - INTERVAL '7 days'
      AND metadata ? 'query'
    GROUP BY 1
    ORDER BY COUNT(*) DESC
    LIMIT ${limit}
  `);

  const queries = result.rows
    .map((row) => (typeof row.query === "string" ? row.query : ""))
    .map((query) => query.trim())
    .filter((query) => query.length > 0);

  return queries.length > 0 ? queries : FALLBACK_QUERIES;
}

export async function warmGraphCache(queries: string[]): Promise<number> {
  let warmed = 0;
  const concurrency = 10;

  for (let i = 0; i < queries.length; i += concurrency) {
    const chunk = queries.slice(i, i + concurrency);
    const results = await Promise.allSettled(
      chunk.map(async (query) => {
        await expandSkillsFromGraph(query);
      })
    );
    warmed += results.filter((result) => result.status === "fulfilled").length;
  }

  return warmed;
}
