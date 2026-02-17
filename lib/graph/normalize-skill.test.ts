import assert from "node:assert/strict";
import test from "node:test";
import { normalizeSkill } from "@/lib/graph/normalize-skill";

test("normalizeSkill maps protected tokens", () => {
  assert.equal(normalizeSkill("C++"), "cpp");
  assert.equal(normalizeSkill("C#"), "csharp");
  assert.equal(normalizeSkill(".NET"), "dotnet");
  assert.equal(normalizeSkill("Node.js"), "nodejs");
});

test("normalizeSkill strips version suffixes", () => {
  assert.equal(normalizeSkill("Python 3.11"), "python");
});
