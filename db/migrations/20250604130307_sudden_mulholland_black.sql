CREATE TABLE "gfo_account" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"id_token" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gfo_session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "gfo_session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "gfo_user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"role" text DEFAULT 'candidate' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "gfo_user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "gfo_verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gfo_candidate_hidden_organisations" (
	"id" text PRIMARY KEY NOT NULL,
	"candidate_user_id" text NOT NULL,
	"organisation_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gfo_candidate_interview_progress" (
	"id" serial PRIMARY KEY NOT NULL,
	"candidate_user_id" text NOT NULL,
	"company_id" integer NOT NULL,
	"rounds_cleared" integer DEFAULT 0 NOT NULL,
	"total_rounds" integer DEFAULT 0 NOT NULL,
	"date_cleared" timestamp NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"verification_requested_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gfo_candidate_skills" (
	"id" text PRIMARY KEY NOT NULL,
	"candidate_user_id" text NOT NULL,
	"skill_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gfo_candidates" (
	"user_id" text PRIMARY KEY NOT NULL,
	"years_experience" integer DEFAULT 0 NOT NULL,
	"location" text NOT NULL,
	"bio" text,
	"resume_url" text NOT NULL,
	"verification_status" text DEFAULT 'unverified' NOT NULL,
	"verification_requested_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gfo_companies" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "gfo_companies_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "gfo_interview_documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"interview_progress_id" integer NOT NULL,
	"document_url" text NOT NULL,
	"subject" text NOT NULL,
	"note" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gfo_skills_library" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "gfo_skills_library_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "gfo_contacts" (
	"id" serial PRIMARY KEY NOT NULL,
	"recruiter_user_id" text NOT NULL,
	"candidate_user_id" text NOT NULL,
	"contacter" text NOT NULL,
	"contacted_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gfo_partner_organisations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"domain" text NOT NULL,
	"website" text NOT NULL,
	"team_size" text NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "gfo_partner_organisations_name_unique" UNIQUE("name"),
	CONSTRAINT "gfo_partner_organisations_domain_unique" UNIQUE("domain")
);
--> statement-breakpoint
CREATE TABLE "gfo_recruiters" (
	"user_id" text PRIMARY KEY NOT NULL,
	"organisation_id" integer NOT NULL,
	"verification_status" text DEFAULT 'unverified' NOT NULL,
	"verification_requested_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "gfo_account" ADD CONSTRAINT "gfo_account_user_id_gfo_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."gfo_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gfo_session" ADD CONSTRAINT "gfo_session_user_id_gfo_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."gfo_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gfo_candidate_hidden_organisations" ADD CONSTRAINT "gfo_candidate_hidden_organisations_candidate_user_id_gfo_candidates_user_id_fk" FOREIGN KEY ("candidate_user_id") REFERENCES "public"."gfo_candidates"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gfo_candidate_hidden_organisations" ADD CONSTRAINT "gfo_candidate_hidden_organisations_organisation_id_gfo_partner_organisations_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."gfo_partner_organisations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gfo_candidate_interview_progress" ADD CONSTRAINT "gfo_candidate_interview_progress_candidate_user_id_gfo_candidates_user_id_fk" FOREIGN KEY ("candidate_user_id") REFERENCES "public"."gfo_candidates"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gfo_candidate_interview_progress" ADD CONSTRAINT "gfo_candidate_interview_progress_company_id_gfo_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."gfo_companies"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gfo_candidate_skills" ADD CONSTRAINT "gfo_candidate_skills_candidate_user_id_gfo_candidates_user_id_fk" FOREIGN KEY ("candidate_user_id") REFERENCES "public"."gfo_candidates"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gfo_candidate_skills" ADD CONSTRAINT "gfo_candidate_skills_skill_id_gfo_skills_library_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."gfo_skills_library"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gfo_candidates" ADD CONSTRAINT "gfo_candidates_user_id_gfo_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."gfo_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gfo_interview_documents" ADD CONSTRAINT "gfo_interview_documents_interview_progress_id_gfo_candidate_interview_progress_id_fk" FOREIGN KEY ("interview_progress_id") REFERENCES "public"."gfo_candidate_interview_progress"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gfo_contacts" ADD CONSTRAINT "gfo_contacts_recruiter_user_id_gfo_recruiters_user_id_fk" FOREIGN KEY ("recruiter_user_id") REFERENCES "public"."gfo_recruiters"("user_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gfo_contacts" ADD CONSTRAINT "gfo_contacts_candidate_user_id_gfo_candidates_user_id_fk" FOREIGN KEY ("candidate_user_id") REFERENCES "public"."gfo_candidates"("user_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gfo_recruiters" ADD CONSTRAINT "gfo_recruiters_user_id_gfo_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."gfo_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gfo_recruiters" ADD CONSTRAINT "gfo_recruiters_organisation_id_gfo_partner_organisations_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."gfo_partner_organisations"("id") ON DELETE restrict ON UPDATE no action;