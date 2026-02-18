# GetFinalOffer

Production-grade AI recruitment platform with hybrid search, asynchronous ingestion, and graph-based skill expansion.

[![Live Demo](https://img.shields.io/badge/demo-live-success?style=for-the-badge)](https://getfinaloffer.vercel.app)
[![GitHub](https://img.shields.io/badge/source-github-181717?style=for-the-badge&logo=github)](https://github.com/sandeepbist/GetFinalOffer)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)

## Project Overview

GetFinalOffer is a recruiting intelligence system focused on one core problem: recruiter intent and candidate profiles often describe the same skills with different language.

The platform combines:
- baseline hybrid search (keyword + vector + strategist expansion)
- event-driven ingestion and indexing workers
- graph-based skill expansion with Neo4j
- Redis-backed cache and index layers for low-latency retrieval

## Problem and Approach

Traditional ATS matching fails on semantic and transferable skills.

Example:
- Recruiter query: `Machine Learning Engineer`
- Candidate profile: `Python`, `PyTorch`, `MLOps`, `Docker`, `Statistics`

Keyword-only matching misses many relevant profiles. GetFinalOffer expands from role/skill seeds into related skills, then blends graph score with baseline ranking to improve recall without replacing the existing fallback path.

## Architecture

### High-Level Architecture
![High Level Architecture](public/HLA.png)

### Ingestion Pipeline
![Ingestion Pipeline 1](public/ING1.png)
![Ingestion Pipeline 2](public/ING2.png)
![Ingestion Pipeline 3](public/ING3.png)

### Search Flow
![Search Flow](public/SFD.png)

### Additional System Visuals
![Cost](public/COST.png)
![Multi Agent](public/AGENT.png)
![Resilience](public/RESIL.png)

## Search Pipeline (Baseline + Graph)

### Baseline Search
1. Query arrives at recruiter search API.
2. Strategist expands intent terms.
3. Live candidate index and vector path retrieve baseline pool.
4. Baseline ranking is returned when graph is off/unavailable.

### Graph Expansion Path
1. Graph execution is controlled by feature flags (`off|shadow|on`).
2. Query and strategist hints generate deterministic graph seeds.
3. Neo4j returns expanded skills via role/skill/alias traversal.
4. Candidate graph score is computed and blended into ranking when mode is `on`.
5. Circuit breaker and fallback guarantee baseline path remains available.

### Current Measured Snapshot (Local, Aura Free, Shadow Tuning)
- Cached graph expansion: roughly `p50 ~40ms`, `p95 ~50ms`
- Uncached graph expansion (no-cache benchmark): roughly `p50 ~430ms`, `p95 ~855ms`
- Fallback rate after tuning in uncached benchmark: `0%` on the tested set

These numbers are environment-specific and should be re-measured in staging/prod.

## Skill Graph Module

### Core Components
- `lib/graph/driver.ts`: Neo4j driver lifecycle
- `lib/graph/circuit-breaker.ts`: opossum-wrapped graph query protection
- `lib/graph/expansion-service.ts`: seed lookup + traversal + cache
- `lib/graph/scoring.ts`: depth/weight/idf/top-k scoring
- `scripts/graph/*.ts`: taxonomy import/build/validate/sync/benchmark tooling
- `workers/graph-*.ts`: sync, metrics flush, alert evaluation, proposal ranking

### Taxonomy Strategy
- Curated base: `data/skill-graph/taxonomy.v1.json`
- Synonym bridges: `data/skill-graph/mappings/tech-synonyms.json`
- Generated artifacts (ESCO/O*NET derived) are intentionally excluded from Git

## Local Setup

### Prerequisites
- Node.js 20+
- pnpm
- PostgreSQL (Supabase recommended)
- Redis (Upstash recommended)
- Neo4j (AuraDB recommended)

### Install
```bash
pnpm install
```

### Run App + Workers
```bash
pnpm run dev
pnpm exec tsx -r dotenv/config workers/index.ts
```

## Environment Variables

### App and Data
- `DATABASE_URL`
- `DB_MAX_CONNECTIONS` (optional)
- `REDIS_URL`
- `WORKER_DRAIN_DELAY_SECONDS` (optional, seconds; default `300`, valid range `1-600`; tuned for low-traffic/free-tier Redis)
- `OPENAI_API_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` or `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_APP_URL`

### Upstash (if using REST clients)
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `UPSTASH_VECTOR_REST_URL`
- `UPSTASH_VECTOR_REST_TOKEN`

### Graph (Neo4j + Runtime)
- `NEO4J_URI`
- `NEO4J_USERNAME`
- `NEO4J_PASSWORD`
- `NEO4J_DATABASE` (optional)
- `GRAPH_SEARCH_MODE` (`off|shadow|on`)
- `GRAPH_SEARCH_TRAFFIC_PERCENT`
- `GRAPH_BLEND_WEIGHT`
- `GRAPH_BLEND_VARIANT` (optional label)
- `GRAPH_MAX_DEPTH`
- `GRAPH_POLICY_VERSION`
- `GRAPH_TOP_K`
- `GRAPH_EXPANSION_CACHE_TTL_SECONDS`
- `GRAPH_STRICT_SEED_LIMIT`
- `GRAPH_CONTAINS_SEED_LIMIT`
- `GRAPH_STRICT_PATH_LIMIT_PER_SEED`
- `GRAPH_CONTAINS_PATH_LIMIT_PER_SEED`
- `GRAPH_GLOBAL_RESULT_LIMIT`
- `GRAPH_CONTAINS_FALLBACK_DEPTH`
- `GRAPH_BREAKER_TIMEOUT_MS`
- `GRAPH_BREAKER_VOLUME_THRESHOLD`

### Alerting
- `PAGERDUTY_ROUTING_KEY`
- `SLACK_WEBHOOK_URL`
- `ALERT_EMAIL_WEBHOOK_URL`
- `ALERT_EMAIL_RECIPIENTS`

## Graph Data Build and Sync Commands

Run in this order when building a new taxonomy snapshot.

1. Import ESCO source into intermediate taxonomy JSON:
```bash
pnpm graph:import-esco -- --skills "data/esco/skills_en.csv" --relations "data/esco/broaderRelationsSkillPillar_en.csv" --output "data/skill-graph/taxonomy.v1.esco.json" --report "data/skill-graph/reports/esco-import-report.json" --version 1
```

2. Import O*NET source into intermediate taxonomy JSON:
```bash
pnpm graph:import-onet -- --input "data/onet/raw/Skills.txt" --output "data/skill-graph/taxonomy.v1.onet.json" --report "data/skill-graph/reports/onet-import-report.json" --version 1
```

3. Build unified graph taxonomy:
```bash
pnpm graph:build-tech -- --scope all --curated "data/skill-graph/taxonomy.v1.json" --esco "data/skill-graph/taxonomy.v1.esco.json" --onet "data/skill-graph/taxonomy.v1.onet.json" --synonyms "data/skill-graph/mappings/tech-synonyms.json" --output "data/skill-graph/taxonomy.v2.tech.json" --report "data/skill-graph/reports/build-tech-taxonomy-report.json" --version 2
```

4. Validate:
```bash
pnpm graph:validate -- data/skill-graph/taxonomy.v2.tech.json
```

5. Sync taxonomy to Postgres + Neo4j:
```bash
pnpm graph:sync-taxonomy -- --input data/skill-graph/taxonomy.v2.tech.json
```

6. Recompute IDF:
```bash
pnpm graph:backfill-idf
```

7. Warm common queries:
```bash
pnpm graph:warmup
```

8. Benchmark:
```bash
pnpm graph:benchmark -- --warmup 1 --repeat 3
pnpm graph:benchmark -- --no-cache --warmup 1 --repeat 3
```

## Benchmarking and Observability

### Graph Benchmark Script
- `scripts/graph/benchmark.ts`
- Outputs per-query latency, fallback, cache-hit, expansion count, and p50/p95 summaries.

### Graph Diagnose Script
- `scripts/graph/diagnose.ts`
- Confirms node/edge counts, exact/contains seed matches, alias coverage.

### Evaluation Images
![RAG Evaluation 1](public/rag5.jpg)
![RAG Evaluation 2](public/rag4.jpg)
![RAG Evaluation 3](public/rag3.jpg)
![RAG Evaluation 4](public/rag2.jpg)
![Load Test](public/load-test.jpg)

## Deployment Topology

- Frontend/API: Vercel (Next.js)
- Workers: Railway (Docker)
- Primary DB: Supabase Postgres
- Cache and index sets: Upstash Redis
- Graph DB: Neo4j AuraDB

Recommended release flow:
1. Deploy app and workers with `GRAPH_SEARCH_MODE=shadow`.
2. Run taxonomy sync + warmup.
3. Observe graph metrics and fallback behavior.
4. Ramp traffic using feature flags.

Pre-push and release checks: see `docs/release-prepush-checklist.md`.

## Roadmap

### Near-Term
- Complete graph rollout gates for shadow to live traffic ramp.
- Add richer alias coverage and taxonomy QA automation.
- Add dashboarding for graph quality and fallback trends.

### Mid-Term
- Improve uncached graph latency through infra and regional alignment.
- Expand role coverage and multilingual skill normalization.
- Add recruiter-facing explainability for graph matches.

## License

MIT License. See [LICENSE](LICENSE).

## Author

**Sandeep Bist**
- Portfolio: [sandeepbist.vercel.app](https://sandeepbist.vercel.app)
- LinkedIn: [linkedin.com/in/sandeepbist22](https://linkedin.com/in/sandeepbist22)
- GitHub: [@sandeepbist](https://github.com/sandeepbist)
- Email: sbist738@gmail.com

## Acknowledgments

System-design inspiration from production patterns used in search, caching, and resilience engineering communities.
