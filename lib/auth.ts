import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import {
  gfoAccountTable,
  gfoSessionTable,
  gfoVerificationTable,
  gfoUserTable,
} from "@/db/schemas";
import db from "@/db";

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

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "candidate",
        input: true,
      },
    },
  },

  emailAndPassword: {
    enabled: true,
  },
});
