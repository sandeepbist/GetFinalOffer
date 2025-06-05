import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "./schemas";

const DATABASE_URL = process.env.DATABASE_URL;

const POSTGRES_MIGRATING = process.env.POSTGRES_MIGRATING === "true";
const POSTGRES_SEEDING = process.env.POSTGRES_SEEDING === "true";

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in the environment variables");
}

const createPool = () => {
  console.log("Creating new pool");
  return new Pool({
    connectionString: DATABASE_URL,
    max: POSTGRES_MIGRATING || POSTGRES_SEEDING ? 1 : 20,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 2000,
  });
};

const pool = createPool();
const db = drizzle(pool, { schema });

export type db = typeof db;
export default db;
