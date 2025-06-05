import { defineConfig } from "drizzle-kit";
import { config as loadEnv } from "dotenv";

loadEnv({ path: ".env.local" });

export default defineConfig({
  schema: "./db/schemas/index.ts",
  dialect: "postgresql",
  out: "./db/migrations",
  migrations: {
    prefix: "supabase",
  },
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
