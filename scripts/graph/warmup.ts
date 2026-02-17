import { loadTopWarmupQueries, warmGraphCache } from "@/lib/graph/warmup";

async function main() {
  const queries = await loadTopWarmupQueries(100);
  const warmed = await warmGraphCache(queries);
  console.log(`Graph warm-up complete. warmedQueries=${warmed}/${queries.length}`);
  process.exit(0);
}

main().catch((error) => {
  console.error("Graph warm-up failed", error);
  process.exit(1);
});
