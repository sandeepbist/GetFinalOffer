import assert from "node:assert/strict";
import test from "node:test";
import { buildSeedKeywords as buildSeedKeywordsForTest } from "@/lib/graph/seed-builder";

test("buildSeedKeywordsForTest extracts phrase, token and n-gram seeds", () => {
  const seeds = buildSeedKeywordsForTest(
    "Senior Frontend Developer with React and TypeScript",
    ["frontend engineer", "react developer"]
  );

  assert.ok(seeds.strictSeeds.includes("senior frontend developer with react and typescript"));
  assert.ok(seeds.strictSeeds.includes("react"));
  assert.ok(seeds.strictSeeds.includes("typescript"));
  assert.ok(seeds.tokenSeeds.includes("frontend developer"));
  assert.ok(seeds.containsSeeds.includes("frontend"));
});

test("buildSeedKeywordsForTest drops stopword-only and tiny seeds", () => {
  const seeds = buildSeedKeywordsForTest("a and the in", []);
  assert.equal(seeds.tokenSeeds.length, 0);
  assert.equal(seeds.containsSeeds.length, 0);
});

test("buildSeedKeywordsForTest excludes generic role tokens as standalone seeds", () => {
  const seeds = buildSeedKeywordsForTest("Frontend Engineer", []);
  assert.ok(!seeds.tokenSeeds.includes("engineer"));
  assert.ok(seeds.strictSeeds.includes("frontend engineer"));
});
