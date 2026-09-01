CREATE TABLE "gfo_admin_decisions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_user_id" text NOT NULL,
	"actor_email" text NOT NULL,
	"action" text NOT NULL,
	"target_type" text NOT NULL,
	"target_id" text NOT NULL,
	"before_status" text,
	"after_status" text,
	"note" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "admin_decisions_target_idx" ON "gfo_admin_decisions" USING btree ("target_type","target_id");--> statement-breakpoint
CREATE INDEX "admin_decisions_actor_idx" ON "gfo_admin_decisions" USING btree ("actor_user_id");