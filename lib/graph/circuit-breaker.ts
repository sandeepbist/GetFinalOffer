import CircuitBreaker from "opossum";
import { runCypherRead } from "@/lib/graph/driver";

interface GraphCypherPayload {
  query: string;
  params?: Record<string, unknown>;
}

const GRAPH_BREAKER_TIMEOUT_MS = Number(process.env.GRAPH_BREAKER_TIMEOUT_MS || "200");
const GRAPH_BREAKER_VOLUME_THRESHOLD = Number(
  process.env.GRAPH_BREAKER_VOLUME_THRESHOLD || "5"
);

const graphQueryBreaker = new CircuitBreaker(
  async (payload: GraphCypherPayload) =>
    await runCypherRead(payload.query, payload.params ?? {}),
  {
    timeout: Number.isFinite(GRAPH_BREAKER_TIMEOUT_MS) ? GRAPH_BREAKER_TIMEOUT_MS : 200,
    errorThresholdPercentage: 50,
    resetTimeout: 30_000,
    volumeThreshold: Number.isFinite(GRAPH_BREAKER_VOLUME_THRESHOLD)
      ? GRAPH_BREAKER_VOLUME_THRESHOLD
      : 5,
    name: "graph-expansion-breaker",
  }
);

graphQueryBreaker.fallback(() => []);

graphQueryBreaker.on("open", () => {
  console.warn("Circuit Breaker OPEN: graph-expansion-breaker");
});

graphQueryBreaker.on("halfOpen", () => {
  console.log("Circuit Breaker HALF-OPEN: graph-expansion-breaker");
});

graphQueryBreaker.on("close", () => {
  console.log("Circuit Breaker CLOSED: graph-expansion-breaker");
});

graphQueryBreaker.on("timeout", () => {
  console.warn("Circuit Breaker TIMEOUT: graph-expansion-breaker");
});

graphQueryBreaker.on("failure", (error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.warn(`Circuit Breaker FAILURE: graph-expansion-breaker (${message})`);
});

export async function runGraphQueryWithBreaker<T = Record<string, unknown>>(
  query: string,
  params: Record<string, unknown> = {}
): Promise<T[]> {
  return (await graphQueryBreaker.fire({ query, params })) as T[];
}

export function getGraphBreakerState(): string {
  return graphQueryBreaker.status.stats.fires > 0 && graphQueryBreaker.opened
    ? "open"
    : "closed";
}
