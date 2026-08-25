/**
 * GetFinalOffer — Taxonomy v3 Generator Entry Point
 *
 * Generates a comprehensive, production-grade 10,000+ node skill taxonomy graph.
 *
 * Usage:
 *   pnpm exec tsx scripts/graph/generate-taxonomy-v3.ts
 *   pnpm exec tsx scripts/graph/generate-taxonomy-v3.ts data/skill-graph/taxonomy.v3.json
 */

import { main } from "./taxonomy-v3/generate";

main();
