import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

import { gfoUserTable } from "../auth/auth-schemas";
import {
  gfoContactsTable,
  gfoPartnerOrganisationsTable,
} from "../recruiter/recruiter-schemas";

export const gfoSkillsLibraryTable = pgTable("gfo_skills_library", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const gfoCompaniesTable = pgTable("gfo_companies", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const gfoCandidatesTable = pgTable("gfo_candidates", {
  userId: text("user_id")
    .primaryKey()
    .notNull()
    .references(() => gfoUserTable.id, { onDelete: "cascade" }),
  yearsExperience: integer("years_experience").notNull().default(0),
  location: text("location").notNull(),
  bio: text("bio"),
  professionalTitle: text("professional_title"),
  currentRole: text("current_role"),
  resumeUrl: text("resume_url").notNull(),
  verificationStatus: text("verification_status")
    .notNull()
    .default("unverified"),
  verificationRequestedAt: timestamp("verification_requested_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const gfoCandidatesRelations = relations(
  gfoCandidatesTable,
  ({ one, many }) => ({
    user: one(gfoUserTable, {
      fields: [gfoCandidatesTable.userId],
      references: [gfoUserTable.id],
    }),
    skills: many(gfoCandidateSkillsTable),
    hiddenOrganisations: many(gfoCandidateHiddenOrganisationsTable),
    interviewProgress: many(gfoCandidateInterviewProgressTable),
    contacts: many(gfoContactsTable),
  })
);

export const gfoCandidateSkillsTable = pgTable("gfo_candidate_skills", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  candidateUserId: text("candidate_user_id")
    .notNull()
    .references(() => gfoCandidatesTable.userId, { onDelete: "cascade" }),
  skillId: text("skill_id")
    .notNull()
    .references(() => gfoSkillsLibraryTable.id, { onDelete: "restrict" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const gfoCandidateSkillsRelations = relations(
  gfoCandidateSkillsTable,
  ({ one }) => ({
    candidate: one(gfoCandidatesTable, {
      fields: [gfoCandidateSkillsTable.candidateUserId],
      references: [gfoCandidatesTable.userId],
    }),
    skill: one(gfoSkillsLibraryTable, {
      fields: [gfoCandidateSkillsTable.skillId],
      references: [gfoSkillsLibraryTable.id],
    }),
  })
);

export const gfoCandidateHiddenOrganisationsTable = pgTable(
  "gfo_candidate_hidden_organisations",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    candidateUserId: text("candidate_user_id")
      .notNull()
      .references(() => gfoCandidatesTable.userId, { onDelete: "cascade" }),
    organisationId: text("organisation_id")
      .notNull()
      .references(() => gfoPartnerOrganisationsTable.id, {
        onDelete: "cascade",
      }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  }
);

export const gfoCandidateHiddenOrganisationsRelations = relations(
  gfoCandidateHiddenOrganisationsTable,
  ({ one }) => ({
    candidate: one(gfoCandidatesTable, {
      fields: [gfoCandidateHiddenOrganisationsTable.candidateUserId],
      references: [gfoCandidatesTable.userId],
    }),
    organisation: one(gfoPartnerOrganisationsTable, {
      fields: [gfoCandidateHiddenOrganisationsTable.organisationId],
      references: [gfoPartnerOrganisationsTable.id],
    }),
  })
);

export const gfoCandidateInterviewProgressTable = pgTable(
  "gfo_candidate_interview_progress",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    candidateUserId: text("candidate_user_id")
      .notNull()
      .references(() => gfoCandidatesTable.userId, { onDelete: "cascade" }),
    companyId: text("company_id")
      .notNull()
      .references(() => gfoCompaniesTable.id, { onDelete: "restrict" }),
    roundsCleared: integer("rounds_cleared").notNull().default(0),
    totalRounds: integer("total_rounds").notNull().default(0),
    dateCleared: timestamp("date_cleared").notNull(),
    status: text("status").notNull().default("On Hold"),
    verificationStatus: text("verification_status")
      .notNull()
      .default("unverified"),
    position: text("position").notNull(),
    verificationRequestedAt: timestamp("verification_requested_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  }
);

export const gfoCandidateInterviewProgressRelations = relations(
  gfoCandidateInterviewProgressTable,
  ({ one, many }) => ({
    candidate: one(gfoCandidatesTable, {
      fields: [gfoCandidateInterviewProgressTable.candidateUserId],
      references: [gfoCandidatesTable.userId],
    }),
    company: one(gfoCompaniesTable, {
      fields: [gfoCandidateInterviewProgressTable.companyId],
      references: [gfoCompaniesTable.id],
    }),
    documents: many(gfoInterviewDocumentsTable),
  })
);

export const gfoInterviewDocumentsTable = pgTable("gfo_interview_documents", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  interviewProgressId: text("interview_progress_id")
    .notNull()
    .references(() => gfoCandidateInterviewProgressTable.id, {
      onDelete: "cascade",
    }),
  documentUrl: text("document_url").notNull(),
  subject: text("subject").notNull(),
  note: text("note"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const gfoInterviewDocumentsRelations = relations(
  gfoInterviewDocumentsTable,
  ({ one }) => ({
    interviewProgress: one(gfoCandidateInterviewProgressTable, {
      fields: [gfoInterviewDocumentsTable.interviewProgressId],
      references: [gfoCandidateInterviewProgressTable.id],
    }),
  })
);
