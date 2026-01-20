import {
  pgTable,
  text,
  integer,
  timestamp,
  index,
  vector,
  boolean,
  real,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

import { gfoUserTable } from "../auth/auth-schemas";
import {
  gfoContactsTable,
  gfoPartnerOrganisationsTable,
} from "../recruiter/recruiter-schemas";

export const evidenceTypeEnum = pgEnum("evidence_type", [
  "resume_section",
  "project_description",
  "github_code",
  "interview_verified",
]);

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
    .references(() => gfoUserTable.id, { onDelete: "cascade" }),
  professionalTitle: text("professional_title"),
  currentRole: text("current_role"),
  yearsExperience: integer("years_experience").default(0).notNull(),
  location: text("location").notNull(),
  bio: text("bio"),
  resumeUrl: text("resume_url").notNull(),
  verificationStatus: text("verification_status")
    .default("unverified")
    .notNull(),

  verifiedBoost: boolean("verified_boost").default(false).notNull(),

  verificationRequestedAt: timestamp("verification_requested_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const gfoCandidateResumeChunksTable = pgTable(
  "gfo_candidate_resume_chunks",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    candidateUserId: text("candidate_user_id")
      .notNull()
      .references(() => gfoCandidatesTable.userId, { onDelete: "cascade" }),
    chunkContent: text("chunk_content").notNull(),
    chunkIndex: integer("chunk_index").notNull(),
    embedding: vector("embedding", { dimensions: 1536 }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("chunk_embedding_idx").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops")
    ),
  ]
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

export const gfoSkillEvidenceTable = pgTable("gfo_skill_evidence", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  candidateSkillId: text("candidate_skill_id")
    .notNull()
    .references(() => gfoCandidateSkillsTable.id, { onDelete: "cascade" }),

  confidenceScore: real("confidence_score").notNull(),
  sourceContext: text("source_context").notNull(),
  evidenceType: evidenceTypeEnum("evidence_type").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const gfoSearchQueryRegistryTable = pgTable("gfo_search_query_registry", {
  queryHash: text("query_hash").primaryKey(),
  rawQuery: text("raw_query").notNull(),
  lastSearchedAt: timestamp("last_searched_at").defaultNow(),
});

export const gfoSearchInsightsTable = pgTable("gfo_search_insights", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  queryHash: text("query_hash")
    .notNull()
    .references(() => gfoSearchQueryRegistryTable.queryHash, { onDelete: "cascade" }),
  candidateUserId: text("candidate_user_id")
    .notNull()
    .references(() => gfoCandidatesTable.userId, { onDelete: "cascade" }),
  explanation: text("explanation"),
  suggestedQuestions: jsonb("suggested_questions"),
  isGolden: boolean("is_golden").default(false),

  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("insight_lookup_idx").on(table.queryHash, table.candidateUserId),
]);

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
    resumeChunks: many(gfoCandidateResumeChunksTable),
    searchInsights: many(gfoSearchInsightsTable),
  })
);

export const gfoCandidateResumeChunksRelations = relations(
  gfoCandidateResumeChunksTable,
  ({ one }) => ({
    candidate: one(gfoCandidatesTable, {
      fields: [gfoCandidateResumeChunksTable.candidateUserId],
      references: [gfoCandidatesTable.userId],
    }),
  })
);

export const gfoCandidateSkillsRelations = relations(
  gfoCandidateSkillsTable,
  ({ one, many }) => ({
    candidate: one(gfoCandidatesTable, {
      fields: [gfoCandidateSkillsTable.candidateUserId],
      references: [gfoCandidatesTable.userId],
    }),
    skill: one(gfoSkillsLibraryTable, {
      fields: [gfoCandidateSkillsTable.skillId],
      references: [gfoSkillsLibraryTable.id],
    }),
    evidence: many(gfoSkillEvidenceTable),
  })
);

export const gfoSkillEvidenceRelations = relations(
  gfoSkillEvidenceTable,
  ({ one }) => ({
    parentSkill: one(gfoCandidateSkillsTable, {
      fields: [gfoSkillEvidenceTable.candidateSkillId],
      references: [gfoCandidateSkillsTable.id],
    }),
  })
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

export const gfoInterviewDocumentsRelations = relations(
  gfoInterviewDocumentsTable,
  ({ one }) => ({
    interviewProgress: one(gfoCandidateInterviewProgressTable, {
      fields: [gfoInterviewDocumentsTable.interviewProgressId],
      references: [gfoCandidateInterviewProgressTable.id],
    }),
  })
);

export const gfoSearchInsightsRelations = relations(
  gfoSearchInsightsTable,
  ({ one }) => ({
    query: one(gfoSearchQueryRegistryTable, {
      fields: [gfoSearchInsightsTable.queryHash],
      references: [gfoSearchQueryRegistryTable.queryHash],
    }),
    candidate: one(gfoCandidatesTable, {
      fields: [gfoSearchInsightsTable.candidateUserId],
      references: [gfoCandidatesTable.userId],
    }),
  })
);