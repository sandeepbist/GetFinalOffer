ALTER TABLE "gfo_account" ADD COLUMN "issuer" text;--> statement-breakpoint
DO $$
BEGIN
  -- better-auth >= 1.7 keys credential accounts on (issuer, accountId) and
  -- matches sign-in against issuer = 'local:credential'. Every account row
  -- created by earlier versions must be backfilled or its user cannot
  -- sign in after the upgrade.
  UPDATE "gfo_account" SET "issuer" = 'local:credential' WHERE "provider_id" = 'credential' AND "issuer" IS NULL;
END
$$;
