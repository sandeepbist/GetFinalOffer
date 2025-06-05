ALTER TABLE "gfo_candidate_interview_progress" ADD COLUMN "position" text NOT NULL;--> statement-breakpoint
ALTER TABLE "gfo_candidates" ADD COLUMN "professional_title" text;--> statement-breakpoint
ALTER TABLE "gfo_candidates" ADD COLUMN "current_role" text;