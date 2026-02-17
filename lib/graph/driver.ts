import { isGraphConfigured } from "@/lib/graph/config";

type Neo4jQueryResultLike = {
  records: Neo4jRecordLike[];
};

type Neo4jRecordLike = {
  toObject: () => Record<string, unknown>;
};

type Neo4jTransactionLike = {
  run: (query: string, params?: Record<string, unknown>) => Promise<Neo4jQueryResultLike>;
};

type Neo4jSessionLike = {
  executeRead: <T>(work: (tx: Neo4jTransactionLike) => Promise<T>) => Promise<T>;
  executeWrite: <T>(work: (tx: Neo4jTransactionLike) => Promise<T>) => Promise<T>;
  close: () => Promise<void>;
};

type Neo4jDriverLike = {
  verifyConnectivity: () => Promise<void>;
  session: (config: { database?: string; defaultAccessMode: unknown }) => Neo4jSessionLike;
  close: () => Promise<void>;
};

type Neo4jModuleLike = {
  driver: (
    uri?: string,
    authToken?: unknown,
    config?: {
      maxConnectionPoolSize?: number;
      connectionTimeout?: number;
      disableLosslessIntegers?: boolean;
    }
  ) => Neo4jDriverLike;
  auth: {
    basic: (username?: string, password?: string) => unknown;
  };
  session: {
    READ: unknown;
    WRITE: unknown;
  };
};

function isNeo4jModuleLike(value: unknown): value is Neo4jModuleLike {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<Neo4jModuleLike>;
  return (
    typeof candidate.driver === "function" &&
    typeof candidate.auth?.basic === "function" &&
    candidate.session != null &&
    Object.prototype.hasOwnProperty.call(candidate.session, "READ") &&
    Object.prototype.hasOwnProperty.call(candidate.session, "WRITE")
  );
}

let cachedDriver: Neo4jDriverLike | null = null;
let connectivityChecked = false;
let cachedNeo4jModule: Neo4jModuleLike | null | undefined;
let neo4jModuleLoading: Promise<Neo4jModuleLike | null> | null = null;

async function loadNeo4jModule(): Promise<Neo4jModuleLike | null> {
  if (cachedNeo4jModule !== undefined) return cachedNeo4jModule;
  if (neo4jModuleLoading) return neo4jModuleLoading;

  neo4jModuleLoading = import("neo4j-driver")
    .then((module) => {
      const moduleCandidate =
        (module as { default?: unknown }).default ?? (module as unknown);
      cachedNeo4jModule = isNeo4jModuleLike(moduleCandidate) ? moduleCandidate : null;
      return cachedNeo4jModule;
    })
    .catch(() => {
      cachedNeo4jModule = null;
      return null;
    })
    .finally(() => {
      neo4jModuleLoading = null;
    });

  return neo4jModuleLoading;
}

function toNative(value: unknown): unknown {
  if (value == null) return value;

  if (Array.isArray(value)) {
    return value.map(toNative);
  }

  if (typeof value === "object") {
    const maybeInt = value as { toNumber?: () => number; low?: number; high?: number };
    if (typeof maybeInt.toNumber === "function") {
      return maybeInt.toNumber();
    }

    const output: Record<string, unknown> = {};
    for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
      output[key] = toNative(nested);
    }
    return output;
  }

  return value;
}

export async function getNeo4jDriver(): Promise<Neo4jDriverLike | null> {
  if (!isGraphConfigured()) return null;

  if (cachedDriver) return cachedDriver;

  const neo4j = await loadNeo4jModule();
  if (!neo4j) return null;

  cachedDriver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD),
    {
      maxConnectionPoolSize: 20,
      connectionTimeout: 3000,
      disableLosslessIntegers: false,
    }
  );

  return cachedDriver;
}

async function ensureConnectivity(driver: Neo4jDriverLike): Promise<void> {
  if (connectivityChecked) return;
  await driver.verifyConnectivity();
  connectivityChecked = true;
}

export async function runCypherRead<T = Record<string, unknown>>(
  query: string,
  params: Record<string, unknown> = {}
): Promise<T[]> {
  const driver = await getNeo4jDriver();
  if (!driver) return [];
  const neo4j = await loadNeo4jModule();
  if (!neo4j) return [];

  await ensureConnectivity(driver);

  const session = driver.session({
    database: process.env.NEO4J_DATABASE || undefined,
    defaultAccessMode: neo4j.session.READ,
  });

  try {
    const result = await session.executeRead((tx) => tx.run(query, params));
    return result.records.map((record) => toNative(record.toObject()) as T);
  } finally {
    await session.close();
  }
}

export async function runCypherWrite<T = Record<string, unknown>>(
  query: string,
  params: Record<string, unknown> = {}
): Promise<T[]> {
  const driver = await getNeo4jDriver();
  if (!driver) return [];
  const neo4j = await loadNeo4jModule();
  if (!neo4j) return [];

  await ensureConnectivity(driver);

  const session = driver.session({
    database: process.env.NEO4J_DATABASE || undefined,
    defaultAccessMode: neo4j.session.WRITE,
  });

  try {
    const result = await session.executeWrite((tx) => tx.run(query, params));
    return result.records.map((record) => toNative(record.toObject()) as T);
  } finally {
    await session.close();
  }
}

export async function closeNeo4jDriver(): Promise<void> {
  if (!cachedDriver) return;
  await cachedDriver.close();
  cachedDriver = null;
  connectivityChecked = false;
}
