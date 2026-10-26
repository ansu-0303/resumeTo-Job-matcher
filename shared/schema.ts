import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Pre-defined fresher roles to match against
export const jobRoles = pgTable("job_roles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  requiredSkills: text("required_skills").array().notNull(),
});

// Analysis results
export const analyses = pgTable("analyses", {
  id: serial("id").primaryKey(),
  resumeText: text("resume_text").notNull(),
  jobRoleId: integer("job_role_id").references(() => jobRoles.id).notNull(),
  matchScore: integer("match_score").notNull(), // 0-100
  explanation: text("explanation").notNull(),
  missingSkills: text("missing_skills").array().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertJobRoleSchema = createInsertSchema(jobRoles).omit({ id: true });
export const insertAnalysisSchema = createInsertSchema(analyses).omit({ id: true, createdAt: true });

export type JobRole = typeof jobRoles.$inferSelect;
export type InsertJobRole = z.infer<typeof insertJobRoleSchema>;

export type Analysis = typeof analyses.$inferSelect;
export type InsertAnalysis = z.infer<typeof insertAnalysisSchema>;

// Request type for the analysis endpoint
export const analyzeResumeSchema = z.object({
  resumeText: z.string().min(50, "Resume text must be at least 50 characters"),
  jobRoleId: z.number().int(),
});

export type AnalyzeResumeRequest = z.infer<typeof analyzeResumeSchema>;
