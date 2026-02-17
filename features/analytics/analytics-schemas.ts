import {
  pgTable,
  text,
  timestamp,
  uuid,
  jsonb,
  real,
  integer,
  index,
} from "drizzle-orm/pg-core";

export const gfoSearchLogsTable = pgTable("gfo_search_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  recruiterUserId: text("recruiter_user_id").notNull(),
  eventType: text("event_type").notNull(),
  metadata: jsonb("metadata").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const gfoGraphMetricsMinuteTable = pgTable(
  "gfo_graph_metrics_minute",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    bucketStart: timestamp("bucket_start").notNull(),
    metricName: text("metric_name").notNull(),
    metricValue: real("metric_value").notNull().default(0),
    dimensions: jsonb("dimensions"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [
    index("graph_metrics_minute_lookup_idx").on(table.bucketStart, table.metricName),
  ]
);

export const gfoGraphRolloutSnapshotsTable = pgTable(
  "gfo_graph_rollout_snapshots",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    mode: text("mode").notNull(),
    trafficPercent: integer("traffic_percent").notNull().default(0),
    blendVariant: text("blend_variant"),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [index("graph_rollout_created_idx").on(table.createdAt)]
);
