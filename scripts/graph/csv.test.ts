import assert from "node:assert/strict";
import test from "node:test";
import { parseCsvRecords } from "@/scripts/graph/csv";

test("parseCsvRecords handles quoted commas and escaped quotes", () => {
  const csv = [
    'id,name,alt',
    '1,"JavaScript, Advanced","js|javascript"',
    '2,"He said ""hello""","quote"',
  ].join("\n");

  const rows = parseCsvRecords(csv);
  assert.equal(rows.length, 2);
  assert.equal(rows[0].name, "JavaScript, Advanced");
  assert.equal(rows[1].name, 'He said "hello"');
});

test("parseCsvRecords handles multiline fields", () => {
  const csv = [
    'id,name,description',
    '1,React,"component',
    'library"',
    '2,Node.js,"runtime"',
  ].join("\n");

  const rows = parseCsvRecords(csv);
  assert.equal(rows.length, 2);
  assert.equal(rows[0].description, "component\nlibrary");
});

test("parseCsvRecords auto-detects semicolon delimiters", () => {
  const csv = [
    "id;name;category",
    "1;TypeScript;language",
    "2;Docker;tooling",
  ].join("\n");

  const rows = parseCsvRecords(csv);
  assert.equal(rows.length, 2);
  assert.equal(rows[1].name, "Docker");
});
