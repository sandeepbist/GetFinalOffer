CREATE TYPE "public"."evidence_type" AS ENUM('resume_section', 'project_description', 'github_code', 'interview_verified');--> statement-breakpoint
CREATE TABLE "gfo_search_insights" (
	"id" text PRIMARY KEY NOT NULL,
	"query_hash" text NOT NULL,
	"candidate_user_id" text NOT NULL,
	"explanation" text,
	"suggested_questions" jsonb,
	"is_golden" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "gfo_search_query_registry" (
	"query_hash" text PRIMARY KEY NOT NULL,
	"raw_query" text NOT NULL,
	"last_searched_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "gfo_skill_evidence" (
	"id" text PRIMARY KEY NOT NULL,
	"candidate_skill_id" text NOT NULL,
	"confidence_score" real NOT NULL,
	"source_context" text NOT NULL,
	"evidence_type" "evidence_type" NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "gfo_candidates" ADD COLUMN "verified_boost" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "gfo_search_insights" ADD CONSTRAINT "gfo_search_insights_query_hash_gfo_search_query_registry_query_hash_fk" FOREIGN KEY ("query_hash") REFERENCES "public"."gfo_search_query_registry"("query_hash") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gfo_search_insights" ADD CONSTRAINT "gfo_search_insights_candidate_user_id_gfo_candidates_user_id_fk" FOREIGN KEY ("candidate_user_id") REFERENCES "public"."gfo_candidates"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gfo_skill_evidence" ADD CONSTRAINT "gfo_skill_evidence_candidate_skill_id_gfo_candidate_skills_id_fk" FOREIGN KEY ("candidate_skill_id") REFERENCES "public"."gfo_candidate_skills"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "insight_lookup_idx" ON "gfo_search_insights" USING btree ("query_hash","candidate_user_id");