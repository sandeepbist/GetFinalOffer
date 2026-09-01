import {
  pgTable,
  text,
  timestamp,
  uuid,
  index,
} from "drizzle-orm/pg-core";

/**
 * Append-only audit trail for admin actions. Rows are never updated or
 * deleted; a reversal is a new row, not a mutation of an old one.
 */
export const gfoAdminDecisionsTable = pgTable(
  "gfo_admin_decisions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    actorUserId: text("actor_user_id").notNull(),
    actorEmail: text("actor_email").notNull(),
    action: text("action").notNull(),
    // "verification_request" | future targets
    targetType: text("target_type").notNull(),
    targetId: text("target_id").notNull(),
    beforeStatus: text("before_status"),
    afterStatus: text("after_status"),
    note: text("note"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("admin_decisions_target_idx").on(table.targetType, table.targetId),
    index("admin_decisions_actor_idx").on(table.actorUserId),
  ]
);
