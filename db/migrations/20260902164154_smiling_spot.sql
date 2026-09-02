CREATE TABLE "gfo_graph_metrics_daily" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"day" timestamp NOT NULL,
	"metric_name" text NOT NULL,
	"metric_value" real DEFAULT 0 NOT NULL,
	"sample_count" integer DEFAULT 0 NOT NULL,
	"dimensions" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE UNIQUE INDEX "graph_metrics_daily_lookup_idx" ON "gfo_graph_metrics_daily" USING btree ("day","metric_name");--> statement-breakpoint
CREATE INDEX "search_logs_user_created_idx" ON "gfo_search_logs" USING btree ("recruiter_user_id","created_at");--> statement-breakpoint
CREATE INDEX "search_logs_created_idx" ON "gfo_search_logs" USING btree ("created_at");
