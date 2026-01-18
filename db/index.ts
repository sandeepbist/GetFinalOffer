import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schemas";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

const globalQueryClient = global as unknown as { postgres: Pool };

const createPool = () => {
  if (globalQueryClient.postgres) {
    console.log("Using existing Postgres pool");
    return globalQueryClient.postgres;
  }

  console.log("Creating new Postgres pool");
  const newPool = new Pool({
    connectionString: DATABASE_URL,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });

  if (process.env.NODE_ENV !== "production") {
    globalQueryClient.postgres = newPool;
  }

  return newPool;
};

const pool = createPool();
const db = drizzle(pool, { schema });

export type db = typeof db;
export default db;