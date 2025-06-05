import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { gfoUserTable } from "../auth/auth-schemas";
import { gfoCandidatesTable } from "../candidate/candidate-schemas";

export const gfoPartnerOrganisationsTable = pgTable(
  "gfo_partner_organisations",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull().unique(),
    domain: text("domain").notNull().unique(),
    website: text("website").notNull(),
    teamSize: text("team_size").notNull(),
    description: text("description"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  }
);

export const gfoRecruitersTable = pgTable("gfo_recruiters", {
  userId: text("user_id")
    .primaryKey()
    .notNull()
    .references(() => gfoUserTable.id, { onDelete: "cascade" }),
  organisationId: integer("organisation_id")
    .notNull()
    .references(() => gfoPartnerOrganisationsTable.id, {
      onDelete: "restrict",
    }),
  verificationStatus: text("verification_status")
    .notNull()
    .default("unverified"),
  verificationRequestedAt: timestamp("verification_requested_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const gfoRecruitersRelations = relations(
  gfoRecruitersTable,
  ({ one, many }) => ({
    user: one(gfoUserTable, {
      fields: [gfoRecruitersTable.userId],
      references: [gfoUserTable.id],
    }),
    organisation: one(gfoPartnerOrganisationsTable, {
      fields: [gfoRecruitersTable.organisationId],
      references: [gfoPartnerOrganisationsTable.id],
    }),
    contacts: many(gfoContactsTable),
  })
);

export const gfoContactsTable = pgTable("gfo_contacts", {
  id: serial("id").primaryKey(),
  recruiterUserId: text("recruiter_user_id")
    .notNull()
    .references(() => gfoRecruitersTable.userId, { onDelete: "restrict" }),
  candidateUserId: text("candidate_user_id")
    .notNull()
    .references(() => gfoCandidatesTable.userId, { onDelete: "restrict" }),
  contacter: text("contacter").notNull(),
  contactedAt: timestamp("contacted_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const gfoContactsRelations = relations(gfoContactsTable, ({ one }) => ({
  recruiter: one(gfoRecruitersTable, {
    fields: [gfoContactsTable.recruiterUserId],
    references: [gfoRecruitersTable.userId],
  }),
  candidate: one(gfoCandidatesTable, {
    fields: [gfoContactsTable.candidateUserId],
    references: [gfoCandidatesTable.userId],
  }),
}));
