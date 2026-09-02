<div align="center">

<img src="public/HLA.png" alt="GetFinalOffer" width="820" />

# GetFinalOffer

**Recruiting intelligence platform with hybrid search, asynchronous resume ingestion, and graph-based skill expansion.**

[![Live Demo](https://img.shields.io/badge/demo-live-success?style=flat-square)](https://getfinaloffer.vercel.app)
[![GitHub](https://img.shields.io/badge/source-github-181717?style=flat-square&logo=github)](https://github.com/sandeepbist/GetFinalOffer)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![CI](https://img.shields.io/badge/CI-typecheck%20%2B%20unit%20%2B%20taxonomy-2088FF?style=flat-square)](https://github.com/sandeepbist/GetFinalOffer/actions)
[![License: MIT](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)

**TypeScript &nbsp;·&nbsp; Next.js &nbsp;·&nbsp; PostgreSQL + pgvector &nbsp;·&nbsp; Neo4j &nbsp;·&nbsp; Redis &nbsp;·&nbsp; BullMQ &nbsp;·&nbsp; better-auth**

</div>

---

## The problem it solves

Recruiters and candidates describe the same skills in different language.

A recruiter searches for a **Machine Learning Engineer**. The candidate's profile says `Python`, `PyTorch`, `MLOps`, `Docker`, `Statistics`. Keyword search never connects them. GetFinalOffer is built around closing that gap: every query is expanded through a skill taxonomy graph before retrieval, and every stage of the pipeline is measured, cached, and circuit-broken so the graph can fail without taking search down with it.

Two sides use it:

- **Candidates** build a profile, upload a resume, and record verified interview progress at partner companies — with document-backed claims and per-organisation visibility control.
- **Recruiters** at partner organisations search a hybrid index and reach out with invites, seeing verified signals before they spend a screen.

## Features

### Search — recruiter side

- **Tiered hybrid retrieval.** Exact cache, then semantic cache, then the Redis live index, then pgvector — each tier falls back to the next, so a cache miss never becomes an outage.
- **Query understanding.** Conversational queries ("backend wizard") are expanded into concrete technical terms by an LLM step before retrieval.
- **Graph expansion.** A Neo4j skill taxonomy expands role and skill seeds through role/skill/alias traversal, scored with IDF weighting, depth penalties, and per-seniority top-k.
- **Cross-encoder reranking.** A local ONNX model scores query/passage pairs with a hard timeout, falling back to baseline order if the model cannot load in time.
- **AI relevance notes.** The strongest matches carry a one-line evaluation rationale, so a score is never just a number.
- **Stealth enforcement.** A candidate who blocked a recruiter's organisation is invisible in every retrieval path — live, semantic, browse, and direct profile access all return the same not-found.

### Ingestion — candidate side

- **Asynchronous pipeline.** A resume upload flows through a BullMQ chain: LLM skill extraction with confidence scoring, chunking, batched embeddings, then index publication — the request never waits on it.
- **Interview progress.** Per-entry history with verification states; an edit only resets verification when a substantive claim actually changed.
- **Content-hash dedupe.** Re-uploads skip re-embedding unchanged text, keeping OpenAI spend proportional to what actually changed.

### Platform

- **Auth.** Email/password accounts with candidate and recruiter roles. Roles are server-owned: signup always creates a candidate, and the only promotion path is a recruiter flow that verifies the work-email domain server-side. Sign-in and sign-up are rate-limited in shared storage, so limits hold across serverless instances.
- **Verification.** Documents land in private storage; reviewers see short-lived signed links, and every decision writes an append-only audit row.
- **Analytics.** Client events batch to Redis, drain to Postgres through a worker, and failed rows go to a dead-letter queue instead of vanishing.
- **Graph telemetry.** Per-minute metrics flush to Postgres; alert rules watch fallback and zero-expansion rates; rollout snapshots record every flag change.
- **Observability.** Sentry error tracking and OpenTelemetry tracing hooks throughout.

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

## Search pipeline, in order

### Baseline path

1. The search API verifies the caller is a recruiter and applies a rate limit.
2. Page-one queries consult the exact cache, then the semantic cache.
3. The live Redis index and the vector path retrieve the baseline pool.
4. When both come up empty, the browse path returns recently indexed candidates.

### Graph path

1. Execution is feature-flagged — `off`, `shadow`, or `on`, with a traffic-percentage hash for gradual ramps.
2. The query and the expanded keywords become deterministic graph seeds: exact match first, contains fallback second.
3. Neo4j returns related skills via traversal, cached with a configurable TTL.
4. Graph scores blend into the baseline ranking in `on` mode; in `shadow` they are recorded but never applied.
5. A circuit breaker and per-stage fallbacks keep the baseline path available whenever Neo4j is slow or unreachable.

### Measured snapshot

Cached graph expansion runs at roughly `p50 ~40ms`, `p95 ~50ms`; uncached at `p50 ~430ms`, `p95 ~855ms`, with a `0%` fallback rate on the tested benchmark set. These numbers are environment-specific — re-measure in your own environment before ramping traffic.

## Codebase map

| Path | What lives there |
|---|---|
| `app/` | App Router pages and API routes |
| `features/` | Feature modules: data access (server), repositories (client fetchers), use-cases, DTOs, UI |
| `lib/` | Infrastructure: queue, Redis, search engine, graph, agents, reranker, caches, alerts |
| `workers/` | BullMQ workers and interval processors, one entrypoint |
| `scripts/graph/` | Taxonomy import, build, validation, sync, and benchmark tooling |
| `db/` | Drizzle schema, migrations, and the hybrid-search RPC |
| `data/skill-graph/` | Committed taxonomy sources |
| `e2e/` | Playwright specs |

## Roadmap

**Near-term** — graph quality dashboarding for fallback and zero-expansion trends; alias coverage improvements; taxonomy QA automation.

**Mid-term** — uncached latency reduction through regional infrastructure; multilingual skill normalization; recruiter-facing explainability for individual graph matches.

---

<div align="center">

**MIT License** — see [LICENSE](LICENSE).

Built by **[Sandeep Bist](https://sandeepbist.vercel.app)**
[sandeepbist.vercel.app](https://sandeepbist.vercel.app) · [LinkedIn](https://www.linkedin.com/in/sandeepbist22) · [GitHub](https://github.com/sandeepbist) · [Email](mailto:sbist738@gmail.com)

</div>
