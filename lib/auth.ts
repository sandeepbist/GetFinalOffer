import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import {
  gfoAccountTable,
  gfoSessionTable,
  gfoVerificationTable,
  gfoUserTable,
} from "@/db/schemas";
import db from "@/db";
import { upstashSecondaryStorage } from "@/lib/auth/secondary-storage";

// Roles are server-controlled: signup always creates a candidate, and only
// the domain-verified POST /api/recruiter flow can promote to recruiter.
export const USER_ROLES = ["candidate", "recruiter"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: gfoUserTable,
      session: gfoSessionTable,
      account: gfoAccountTable,
      verification: gfoVerificationTable,
    },
  }),

  baseURL: process.env.BETTER_AUTH_URL,
  // The auth endpoints verify the Origin header against this list; the
  // baseURL origin is always trusted implicitly.
  trustedOrigins: (process.env.BETTER_AUTH_TRUSTED_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "candidate",
        // Server-controlled: the signup body can never set or change it.
        input: false,
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    requireEmailVerification: false,
  },

  rateLimit: {
    enabled: true,
    window: 60,
    max: 100,
    // Tighter buckets on the credential endpoints: brute-force password
    // attempts and signup flooding are the two abuse patterns that matter.
    customRules: {
      "/sign-in/email": { max: 10, window: 60 },
      "/sign-up/email": { max: 5, window: 60 },
    },
  },

  secondaryStorage: upstashSecondaryStorage ?? undefined,
});
