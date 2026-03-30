CREATE TABLE "gfo_verification_documents" (
	"id" text PRIMARY KEY NOT NULL,
	"verification_request_id" text NOT NULL,
	"storage_bucket" text DEFAULT 'Verifications' NOT NULL,
	"storage_path" text NOT NULL,
	"original_file_name" text NOT NULL,
	"mime_type" text NOT NULL,
	"size_bytes" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gfo_verification_requests" (
	"id" text PRIMARY KEY NOT NULL,
	"scope" text NOT NULL,
	"target_id" text NOT NULL,
	"requested_by_user_id" text NOT NULL,
	"subject" text NOT NULL,
	"notes" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"requested_at" timestamp DEFAULT now() NOT NULL,
	"reviewed_at" timestamp,
	"reviewed_by_user_id" text,
	"decision_note" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "gfo_interview_documents" CASCADE;--> statement-breakpoint
ALTER TABLE "gfo_verification_documents" ADD CONSTRAINT "gfo_verification_documents_verification_request_id_gfo_verification_requests_id_fk" FOREIGN KEY ("verification_request_id") REFERENCES "public"."gfo_verification_requests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gfo_verification_requests" ADD CONSTRAINT "gfo_verification_requests_requested_by_user_id_gfo_user_id_fk" FOREIGN KEY ("requested_by_user_id") REFERENCES "public"."gfo_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "vr_scope_target_idx" ON "gfo_verification_requests" USING btree ("scope","target_id");--> statement-breakpoint
CREATE INDEX "vr_status_idx" ON "gfo_verification_requests" USING btree ("status");--> statement-breakpoint
CREATE INDEX "vr_requester_idx" ON "gfo_verification_requests" USING btree ("requested_by_user_id");