import { normalizeSkill } from "@/lib/graph/normalize-skill";

const MAX_STRICT_SEEDS = 30;
const MAX_CONTAINS_SEEDS = 12;
const MIN_TOKEN_LENGTH = 3;

const STOPWORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "by",
  "for",
  "from",
  "in",
  "is",
  "of",
  "on",
  "or",
  "that",
  "the",
  "to",
  "with",
  "who",
  "someone",
  "person",
  "expert",
  "skill",
  "skills",
  "high",
  "end",
]);

const GENERIC_ROLE_TOKENS = new Set([
  "engineer",
  "developer",
  "designer",
  "manager",
  "analyst",
  "consultant",
  "architect",
  "specialist",
  "administrator",
  "operator",
  "tester",
  "associate",
  "intern",
  "lead",
  "senior",
  "junior",
  "principal",
  "staff",
  "head",
  "director",
]);

export interface SeedBundle {
  phraseSeeds: string[];
  tokenSeeds: string[];
  strictSeeds: string[];
  containsSeeds: string[];
}

function tokenize(input: string): string[] {
  return normalizeSkill(input)
    .split(" ")
    .map((token) => token.trim())
    .filter(Boolean);
}

function buildNgrams(tokens: string[], n: number): string[] {
  const out: string[] = [];
  for (let i = 0; i <= tokens.length - n; i += 1) {
    const part = tokens.slice(i, i + n);
    if (part.some((token) => STOPWORDS.has(token))) continue;
    if (part.every((token) => GENERIC_ROLE_TOKENS.has(token))) continue;
    out.push(part.join(" "));
  }
  return out;
}

function uniqueLimit(values: string[], limit: number): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const value of values) {
    const normalized = normalizeSkill(value);
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    out.push(normalized);
    if (out.length >= limit) break;
  }
  return out;
}

export function buildSeedKeywords(query: string, hints: string[]): SeedBundle {
  const phraseCandidates = [query, ...hints]
    .flatMap((value) => value.split(","))
    .map((value) => normalizeSkill(value))
    .filter(Boolean);

  const phraseSeeds = uniqueLimit(phraseCandidates, MAX_STRICT_SEEDS);

  const tokenCandidates: string[] = [];
  for (const phrase of phraseCandidates) {
    const tokens = tokenize(phrase);
    for (const token of tokens) {
      if (token.length < MIN_TOKEN_LENGTH || STOPWORDS.has(token)) continue;
      if (GENERIC_ROLE_TOKENS.has(token)) continue;
      tokenCandidates.push(token);
    }
    tokenCandidates.push(...buildNgrams(tokens, 2));
    tokenCandidates.push(...buildNgrams(tokens, 3));
  }

  const tokenSeeds = uniqueLimit(tokenCandidates, MAX_STRICT_SEEDS);
  const strictSeeds = uniqueLimit([...phraseSeeds, ...tokenSeeds], MAX_STRICT_SEEDS);

  const containsSeeds = uniqueLimit(
    tokenSeeds
      .filter((seed) => seed.length >= 4)
      .sort((a, b) => b.length - a.length),
    MAX_CONTAINS_SEEDS
  );

  return {
    phraseSeeds,
    tokenSeeds,
    strictSeeds,
    containsSeeds,
  };
}
