const PROTECTED_TOKEN_MAP: Array<[RegExp, string]> = [
  [/c\+\+/gi, "cpp"],
  [/\bc#/gi, "csharp"],
  [/\b\.net\b/gi, "dotnet"],
  [/\bnode\.js\b/gi, "nodejs"],
  [/\breact\.js\b/gi, "react"],
  [/\bts\b/gi, "typescript"],
  [/\bjs\b/gi, "javascript"],
  [/\bml\b/gi, "machine learning"],
  [/\bnlp\b/gi, "natural language processing"],
];

const VERSION_PATTERNS = [
  /\bv?\d+(\.\d+){1,3}\b/gi,
  /\bpython\s*\d+\b/gi,
  /\bnode\s*\d+\b/gi,
];

export function normalizeSkill(skill: string): string {
  let value = skill.trim().toLowerCase();

  for (const [pattern, replacement] of PROTECTED_TOKEN_MAP) {
    value = value.replace(pattern, replacement);
  }

  for (const pattern of VERSION_PATTERNS) {
    value = value.replace(pattern, "");
  }

  value = value
    .replace(/[_/|]+/g, " ")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, " ")
    .replace(/-+/g, " ")
    .trim();

  return value;
}

export function toGraphSkillKey(skill: string): string {
  return normalizeSkill(skill).replace(/\s+/g, "-");
}
