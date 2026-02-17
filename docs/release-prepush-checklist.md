# Pre-Push Release Checklist

Use this checklist before pushing graph-search changes to the public repo or deploying to production.

## 1) Repository Hygiene

- [ ] `git status` is clean except intended files.
- [ ] No secrets are present in tracked files (`.env`, keys, credentials).
- [ ] Raw/source dataset dumps are not tracked:
  - [ ] `data/esco/**`
  - [ ] `data/onet/**`
  - [ ] `data/Skills.txt`
  - [ ] `data/Occupation Data.txt`
- [ ] Generated taxonomy artifacts are not tracked:
  - [ ] `data/skill-graph/taxonomy.v1.esco.json`
  - [ ] `data/skill-graph/taxonomy.v1.onet.json`
  - [ ] `data/skill-graph/taxonomy.v2.tech.json`
  - [ ] `data/skill-graph/reports/**`
- [ ] Curated graph sources are tracked:
  - [ ] `data/skill-graph/taxonomy.v1.json`
  - [ ] `data/skill-graph/mappings/tech-synonyms.json`
- [ ] Graph scripts are tracked (`scripts/graph/**`).

## 2) Build and Type Safety

- [ ] Install dependencies:
```bash
pnpm install
```
- [ ] Type-check:
```bash
pnpm exec tsc --noEmit --incremental false
```

## 3) Graph Runtime Validation (Local)

- [ ] Run app:
```bash
pnpm run dev
```
- [ ] Run workers:
```bash
pnpm exec tsx -r dotenv/config workers/index.ts
```
- [ ] Run graph diagnosis:
```bash
pnpm exec tsx -r dotenv/config scripts/graph/diagnose.ts
```
- [ ] Run benchmark (cached + no-cache):
```bash
pnpm graph:benchmark -- --warmup 1 --repeat 3
pnpm graph:benchmark -- --no-cache --warmup 1 --repeat 3
```

## 4) Taxonomy Pipeline Validation

- [ ] Validate taxonomy:
```bash
pnpm graph:validate -- data/skill-graph/taxonomy.v2.tech.json
```
- [ ] Sync taxonomy:
```bash
pnpm graph:sync-taxonomy -- --input data/skill-graph/taxonomy.v2.tech.json
```
- [ ] Backfill IDF:
```bash
pnpm graph:backfill-idf
```
- [ ] Warm graph cache:
```bash
pnpm graph:warmup
```

## 5) Feature-Flag Safety

- [ ] `GRAPH_SEARCH_MODE=shadow` for first deploy.
- [ ] `GRAPH_POLICY_VERSION` bumped for taxonomy/policy changes.
- [ ] Circuit breaker settings validated:
  - [ ] `GRAPH_BREAKER_TIMEOUT_MS`
  - [ ] `GRAPH_BREAKER_VOLUME_THRESHOLD`

## 6) Deploy Verification

- [ ] Web/API env vars set in Vercel.
- [ ] Worker env vars set in Railway.
- [ ] Neo4j credentials set in both runtime environments where graph path executes.
- [ ] Post-deploy warmup completed.
- [ ] Metrics reviewed:
  - [ ] fallback count trend
  - [ ] zero expansion trend
  - [ ] graph latency summary

## 7) Documentation

- [ ] `README.md` reflects current commands and architecture.
- [ ] Any rollout or guardrail updates are documented.
