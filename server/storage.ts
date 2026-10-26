import { db } from "./db";
import { eq } from "drizzle-orm";
import {
  jobRoles,
  analyses,
  type JobRole,
  type InsertJobRole,
  type Analysis,
  type InsertAnalysis,
} from "@shared/schema";

export interface IStorage {
  // Job Roles
  getJobRoles(): Promise<JobRole[]>;
  getJobRole(id: number): Promise<JobRole | undefined>;
  createJobRole(role: InsertJobRole): Promise<JobRole>;

  // Analyses
  createAnalysis(analysis: InsertAnalysis): Promise<Analysis>;
  getAnalysis(id: number): Promise<Analysis | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getJobRoles(): Promise<JobRole[]> {
    return await db.select().from(jobRoles);
  }

  async getJobRole(id: number): Promise<JobRole | undefined> {
    const [role] = await db.select().from(jobRoles).where(eq(jobRoles.id, id));
    return role;
  }

  async createJobRole(role: InsertJobRole): Promise<JobRole> {
    const [newRole] = await db.insert(jobRoles).values(role).returning();
    return newRole;
  }

  async createAnalysis(analysis: InsertAnalysis): Promise<Analysis> {
    const [newAnalysis] = await db.insert(analyses).values(analysis).returning();
    return newAnalysis;
  }

  async getAnalysis(id: number): Promise<Analysis | undefined> {
    const [analysis] = await db.select().from(analyses).where(eq(analyses.id, id));
    return analysis;
  }
}

export const storage = new DatabaseStorage();
