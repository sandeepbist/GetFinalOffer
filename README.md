# GetFinalOffer

**Distributed Recruitment Engine • Event-Driven Architecture • Hybrid RAG**

GetFinalOffer is a high-throughput, AI-native recruitment ecosystem designed to solve the **"Lexical Gap"** in talent discovery.

It replaces fragile keyword-based Applicant Tracking Systems (ATS) with a **Multi-Layered Hybrid RAG Engine**, combining vector-based semantic understanding with deterministic SQL logic. The system runs on a resilient, event-driven backbone to ensure zero-latency user interactions, even under heavy ingestion loads.

![High Level Architecture](public/HLA.jpg)

---

## Philosophy: Why I Built This

The modern recruitment stack is fundamentally broken at the data retrieval layer.

1.  **The Lexical Gap:** Traditional search engines rely on exact token matching. If a recruiter searches for *"Backend Scalability"* and a candidate's resume says *"High-throughput distributed systems,"* a standard ATS returns zero results. They mean the same thing, but the keywords don't match.
2.  **Signal vs. Noise:** Resumes are unstructured, noisy documents. A simple "Keyword Match" doesn't differentiate between a candidate who *used* React once in a bootcamp and a candidate who *architected* a React core library.
3.  **The "Write" Bottleneck:** Most platforms couple the heavy lifting (parsing, embedding, indexing) with the user request. This makes them unscalable.

**GetFinalOffer was built to prove that recruitment data can be treated as an Engineering Problem.** By treating resumes as high-dimensional vectors and interview outcomes as immutable signals, we can mathematically guarantee higher relevance and lower latency.

---

## Key Features & Engineering Deep Dive

This project moves beyond standard CRUD patterns. It implements distributed systems concepts to handle scale, cost, and algorithmic complexity.

### 1. Multi-Layered Retrieval Architecture (L1 / L2 / L3)
To balance **Cost (OpenAI tokens)** vs. **Latency (User experience)**, I architected a tiered retrieval strategy that acts like a CPU memory hierarchy:

* **L1: Exact Cache (Redis - 0ms Latency)**
    * **Mechanism:** The system hashes the search query and filters. If this specific query has been run recently, it returns the pre-calculated JSON result instantly.
    * **Why:** Handles "Hot Keys" (e.g., widely used searches like "Senior React Developer") with zero compute cost.

* **L2: Semantic Cache (Vector Pointer Pattern)**
    * **Mechanism:** If L1 misses, we search the **Upstash Vector** index for *semantically similar* queries (Cosine Similarity > 0.95).
    * **Optimization:** Instead of storing the full 50KB candidate profile in the vector metadata (which hits size limits), I store a tiny **"Pointer Key."** This key resolves to the full payload in Redis.
    * **Why:** Drastically reduces vector storage costs (~95% savings) and allows reusing expensive embedding results for "synonymous" searches.

* **L3: Hybrid RAG Search (PostgreSQL + pgvector)**
    * **Mechanism:** If L1 and L2 miss, the system executes a custom **Hybrid RPC** on the database. It combines **Dense Retrieval** (1536d Vectors) with **Sparse Retrieval** (SQL keyword filters) to generate a new result set.

### 2. Adaptive "Google-Style" Thresholding
One of the hardest challenges in Vector Search is choosing the similarity threshold. A strict threshold (>0.5) misses niche candidates; a loose threshold (<0.10) returns hallucinations.

**The Solution:** I implemented **Dynamic Thresholding** within the SQL transaction:
1.  **Phase 1 (Precision):** The engine executes a strict search (0.32 threshold).
2.  **Phase 2 (Recall Fallback):** If the result set size is `< 5`, the engine *automatically* re-runs the query with a wider net (0.10 threshold) and flags the results as "Broad Matches."

### 3. Asynchronous Event-Driven Ingestion
Processing a PDF upload involves: `Validation -> Upload -> OCR/Parsing -> Chunking -> Embedding -> Indexing`. Doing this synchronously guarantees HTTP timeouts.

**The Solution:**
* **Dispatcher Pattern:** The API endpoint (`POST /candidate`) is strictly a dispatcher. It validates the request and pushes a job to **BullMQ**.
* **Worker Isolation:** A dedicated Node.js worker process consumes the queue. It uses **LangChain's RecursiveCharacterSplitter** to segment resumes into "Atomic Contexts" (500 chars).
* **Why:** Massive concurrency. We can process thousands of resumes in parallel by simply spawning more worker containers, without touching the main API.

### 4. High-Throughput Analytics (Buffering & DLQ)
Tracking every user interaction (search, click, view) usually kills database performance due to write-lock contention.

**The Solution:**
* **Redis Buffer:** Analytics events are pushed to a Redis List (`analytics:buffer`) in real-time (O(1) operation).
* **Batch Flush:** A background worker pulls events in batches of 100 and performs a single bulk `INSERT` into PostgreSQL.
* **Dead Letter Queue (DLQ):** If a batch fails (e.g., DB outage), the events are shunted to a DLQ for replay, ensuring **Zero Data Loss**.

---

## Quality Assurance: Adversarial Testing

I didn't just "check if it works." I implemented an automated testing pipeline to mathematically prove the system's robustness under adversarial conditions.

### 1. Adversarial RAG Evaluation (LLM-as-a-Judge)
I developed a custom evaluation script (`scripts/evaluation-rag.ts`) that uses GPT-4o to generate "Tricky" queries for random candidates in the database. The system is tested against three distinct query types:

* **Implicit Queries:** Describes technical concepts without naming the tool (e.g., *"Manages component state and lifecycles"* → matches *"React"*).
* **Problem-Based Queries:** Describes a business outcome (e.g., *"Reduce page load times"* → matches *"Next.js Optimization"*).
* **Vague Queries:** Recruiter slang (e.g., *"Pixel perfectionist"*).

![Adversarial RAG Results](public/RAG.jpg)
*Automated evaluation proving 100% recall on semantic test cases where standard SQL search failed.*

### 2. Stochastic Load Testing (k6)
Using **k6**, I simulated a hostile traffic pattern (`scripts/load-test.js`) to verify the **Adaptive Thresholding** logic under pressure. The test splits traffic into three profiles:

* **Simple Traffic (60%):** High cache-hit ratio.
* **Filtered Traffic (20%):** Complex SQL + Vector combinations.
* **Fallback Traffic (20%):** Specifically targets "Vague" terms to force the engine into **Double Vector Search** mode (Phase 1 + Phase 2), testing the worst-case algorithmic complexity.

![Load Test Results](public/load-test.jpg)
*Benchmarks demonstrating <300ms p95 latency even during "Stress Spike" scenarios (200 concurrent VUs).*

---de

## Tech Stack

* **Core:** Next.js 15 (App Router), TypeScript, Turbopack
* **Data:** PostgreSQL (Supabase), pgvector, Drizzle ORM
* **Async:** BullMQ, Redis (Upstash)
* **AI:** OpenAI (text-embedding-3-small), LangChain
* **Infrastructure:** Docker (Worker Nodes), Vercel (Edge Network)