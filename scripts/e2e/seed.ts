/**
 * E2E database bootstrap: applies Drizzle migrations and seeds the fixture
 * accounts the Playwright suites log in as (see e2e/fixtures.ts).
 *
 * Usage: pnpm e2e:seed
 * Requires DATABASE_URL plus a running Postgres. Safe to re-run: every
 * insert is an on-conflict no-op, and better-auth handles password hashing
 * through its own API surface.
 */

import fs from "fs";
import path from "path";
import { Client } from "pg";
import { hashPassword } from "@better-auth/utils/password";

dotenvSafe();

function dotenvSafe(): void {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const dotenv = require("dotenv");
  dotenv.config({ path: ".env.local" });
  dotenv.config({ path: ".env" });
}

const MIGRATIONS_DIR = path.join(process.cwd(), "db", "migrations");

async function applyMigrations(client: Client): Promise<void> {
  // pgvector ships in the e2e image but is not enabled by default, and the
  // resume-chunk migration assumes the `vector` type exists.
  await client.query("create extension if not exists vector");
  await client.query("create schema if not exists drizzle");
  await client.query("create table if not exists drizzle.__drizzle_migrations (hash text primary key, created_at bigint)");

  const journalPath = path.join(MIGRATIONS_DIR, "meta", "_journal.json");
  const journal = JSON.parse(fs.readFileSync(journalPath, "utf-8")) as {
    entries: Array<{ idx: number; tag: string; when: number }>;
  };

  for (const entry of journal.entries) {
    const file = `${entry.tag}.sql`;
    const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), "utf-8");
    const already = await client.query("select 1 from drizzle.__drizzle_migrations where hash = $1", [entry.tag]);
    if (already.rowCount && already.rowCount > 0) continue;
    await client.query("begin");
    try {
      await client.query(sql);
      await client.query("insert into drizzle.__drizzle_migrations (hash, created_at) values ($1, $2)", [entry.tag, entry.when]);
      await client.query("commit");
      console.log(`[seed] applied ${file}`);
    } catch (err) {
      await client.query("rollback");
      throw err;
    }
  }
}

async function main(): Promise<void> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is not set");

  const client = new Client({ connectionString: databaseUrl });
  await client.connect();

  try {
    await applyMigrations(client);

    // Partner organisation for the recruiter fixture (domain must match the
    // fixture email's domain for the domain-verified recruiter flow).
    await client.query(
      `insert into gfo_partner_organisations (id, name, domain, website, team_size)
       values ($1, $2, $3, $4, $5)
       on conflict (name) do nothing`,
      ["org-e2e", "Airbnb (E2E)", "airbnb.com", "https://airbnb.com", "1000+"]
    );

    // The recruiter signup flow creates these rows via the app; for seed
    // purposes we mirror the end state (verified recruiter with org row and
    // the recruiter role).
    const orgId = (await client.query("select id from gfo_partner_organisations where name = $1", ["Airbnb (E2E)"])).rows[0].id;

    // Fixture passwords come from e2e/fixtures.ts; hashed with better-auth's
    // own scrypt hasher so sign-in verifies them identically.
    const candidatePassword = await hashPassword("123456789");
    const recruiterPassword = await hashPassword("123456789");

    async function upsertUser(name: string, email: string, role: string, hash: string): Promise<string> {
      const user = await client.query(
        `insert into gfo_user (id, name, email, email_verified, role, created_at, updated_at)
         values ($1, $2, $3, true, $4, now(), now())
         on conflict (email) do update set role = excluded.role
         returning id`,
        [`user-${role}-e2e`, name, email, role]
      );
      const userId = user.rows[0].id as string;
      await client.query(
        `insert into gfo_account (id, user_id, account_id, provider_id, issuer, password, created_at, updated_at)
         values ($1, $2, $3, 'credential', 'local:credential', $4, now(), now())
         on conflict (id) do update set password = excluded.password`,
        [`acct-${role}-e2e`, userId, userId, hash]
      );
      return userId;
    }

    await upsertUser("E2E Candidate", "a@a.com", "candidate", candidatePassword);
    const recruiterId = await upsertUser("E2E Recruiter", "harsh@airbnb.com", "recruiter", recruiterPassword);

    await client.query(
      `insert into gfo_recruiters (user_id, organisation_id, verification_status, created_at, updated_at)
       values ($1, $2, 'unverified', now(), now())
       on conflict (user_id) do nothing`,
      [recruiterId, orgId]
    );

    console.log("[seed] fixture users ready: a@a.com / harsh@airbnb.com (password: 123456789)");
  } finally {
    await client.end();
  }
}

void main();
