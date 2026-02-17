CREATE TYPE "public"."graph_proposal_status" AS ENUM('pending', 'approved', 'rejected', 'auto_approved');--> statement-breakpoint
CREATE TABLE "gfo_graph_sync_state" (
	"candidate_user_id" text PRIMARY KEY NOT NULL,
	"last_synced_at" timestamp,
	"last_error" text,
	"retry_count" integer DEFAULT 0 NOT NULL,
	"taxonomy_version" integer DEFAULT 1 NOT NULL,
	"active_candidate_count" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gfo_graph_taxonomy_versions" (
	"id" text PRIMARY KEY NOT NULL,
	"version" integer NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"source" text DEFAULT 'manual',
	"notes" text,
	"is_active" boolean DEFAULT false NOT NULL,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "gfo_graph_taxonomy_versions_version_unique" UNIQUE("version")
);
--> statement-breakpoint
CREATE TABLE "gfo_skill_aliases" (
	"id" text PRIMARY KEY NOT NULL,
	"skill_id" text NOT NULL,
	"alias" text NOT NULL,
	"normalized_alias" text NOT NULL,
	"source" text DEFAULT 'manual' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "gfo_skill_aliases_normalized_alias_unique" UNIQUE("normalized_alias")
);
--> statement-breakpoint
CREATE TABLE "gfo_skill_relationship_proposals" (
	"id" text PRIMARY KEY NOT NULL,
	"from_skill_id" text NOT NULL,
	"to_skill_id" text NOT NULL,
	"relation_type" text NOT NULL,
	"confidence" real DEFAULT 0 NOT NULL,
	"proposal_score" real DEFAULT 0 NOT NULL,
	"source" text DEFAULT 'ai' NOT NULL,
	"source_version" text,
	"review_status" "graph_proposal_status" DEFAULT 'pending' NOT NULL,
	"reviewed_by" text,
	"reviewed_at" timestamp,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gfo_graph_metrics_minute" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"bucket_start" timestamp NOT NULL,
	"metric_name" text NOT NULL,
	"metric_value" real DEFAULT 0 NOT NULL,
	"dimensions" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "gfo_graph_rollout_snapshots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"mode" text NOT NULL,
	"traffic_percent" integer DEFAULT 0 NOT NULL,
	"blend_variant" text,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "gfo_skills_library" ADD COLUMN "normalized_name" text;--> statement-breakpoint
ALTER TABLE "gfo_graph_sync_state" ADD CONSTRAINT "gfo_graph_sync_state_candidate_user_id_gfo_candidates_user_id_fk" FOREIGN KEY ("candidate_user_id") REFERENCES "public"."gfo_candidates"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gfo_skill_aliases" ADD CONSTRAINT "gfo_skill_aliases_skill_id_gfo_skills_library_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."gfo_skills_library"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gfo_skill_relationship_proposals" ADD CONSTRAINT "gfo_skill_relationship_proposals_from_skill_id_gfo_skills_library_id_fk" FOREIGN KEY ("from_skill_id") REFERENCES "public"."gfo_skills_library"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gfo_skill_relationship_proposals" ADD CONSTRAINT "gfo_skill_relationship_proposals_to_skill_id_gfo_skills_library_id_fk" FOREIGN KEY ("to_skill_id") REFERENCES "public"."gfo_skills_library"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "graph_proposal_status_idx" ON "gfo_skill_relationship_proposals" USING btree ("review_status","proposal_score");--> statement-breakpoint
CREATE INDEX "graph_proposal_edge_idx" ON "gfo_skill_relationship_proposals" USING btree ("from_skill_id","to_skill_id");--> statement-breakpoint
CREATE INDEX "graph_metrics_minute_lookup_idx" ON "gfo_graph_metrics_minute" USING btree ("bucket_start","metric_name");--> statement-breakpoint
CREATE INDEX "graph_rollout_created_idx" ON "gfo_graph_rollout_snapshots" USING btree ("created_at");