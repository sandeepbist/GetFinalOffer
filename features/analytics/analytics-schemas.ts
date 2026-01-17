import { pgTable, text, timestamp, uuid, jsonb } from "drizzle-orm/pg-core";

export const gfoSearchLogsTable = pgTable("gfo_search_logs", {
    id: uuid("id").primaryKey().defaultRandom(),
    recruiterUserId: text("recruiter_user_id").notNull(),
    eventType: text("event_type").notNull(),
    metadata: jsonb("metadata").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
});