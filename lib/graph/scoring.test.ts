import assert from "node:assert/strict";
import test from "node:test";
import { computeIdf, getDepthPenalty, normalizeGraphScore } from "@/lib/graph/scoring";

test("computeIdf clamps at lower bound for universal skills", () => {
  const idf = computeIdf(1000, 1000);
  assert.equal(idf, 0.2);
});

test("computeIdf clamps at upper bound for rare skills", () => {
  const idf = computeIdf(100000, 1);
  assert.equal(idf, 3.0);
});

test("depth penalties follow configured defaults", () => {
  assert.equal(getDepthPenalty(1), 1.0);
  assert.equal(getDepthPenalty(2), 0.85);
  assert.equal(getDepthPenalty(3), 0.65);
});

test("normalizeGraphScore returns bounded values", () => {
  const score = normalizeGraphScore(100, 15);
  assert.ok(score <= 1 && score >= 0);
});
