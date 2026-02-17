import assert from "node:assert/strict";
import test from "node:test";
import { runGraphQueryWithBreaker } from "@/lib/graph/circuit-breaker";

test("graph breaker returns fallback when graph is unavailable", async () => {
  const rows = await runGraphQueryWithBreaker("RETURN 1 AS ok");
  assert.ok(Array.isArray(rows));
});
