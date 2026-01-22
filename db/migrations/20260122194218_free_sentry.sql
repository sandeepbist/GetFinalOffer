CREATE TABLE "gfo_contact_details" (
	"id" text PRIMARY KEY NOT NULL,
	"contact_id" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "gfo_contact_details" ADD CONSTRAINT "gfo_contact_details_contact_id_gfo_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."gfo_contacts"("id") ON DELETE cascade ON UPDATE no action;