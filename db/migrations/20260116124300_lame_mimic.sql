CREATE TABLE "gfo_candidate_resume_chunks" (
	"id" text PRIMARY KEY NOT NULL,
	"candidate_user_id" text NOT NULL,
	"chunk_content" text NOT NULL,
	"chunk_index" integer NOT NULL,
	"embedding" vector(1536),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "gfo_candidate_resume_chunks" ADD CONSTRAINT "gfo_candidate_resume_chunks_candidate_user_id_gfo_candidates_user_id_fk" FOREIGN KEY ("candidate_user_id") REFERENCES "public"."gfo_candidates"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "chunk_embedding_idx" ON "gfo_candidate_resume_chunks" USING hnsw ("embedding" vector_cosine_ops);--> statement-breakpoint
ALTER TABLE "gfo_candidates" DROP COLUMN "embedding";