import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { analyzeResume } from "./openai";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // --- Seed Data ---
  const existingRoles = await storage.getJobRoles();
  if (existingRoles.length === 0) {
    console.log("Seeding job roles...");
    await storage.createJobRole({
      title: "Frontend Developer (Entry Level)",
      description: "We are looking for a junior frontend developer with React, HTML, CSS skills. Must be willing to learn and work in a fast-paced environment.",
      requiredSkills: ["React", "HTML", "CSS", "JavaScript", "Git"],
    });
    await storage.createJobRole({
      title: "Backend Developer (Entry Level)",
      description: "Entry level backend developer needed. Experience with Node.js, Python, or Go. Database knowledge (SQL) is a plus.",
      requiredSkills: ["Node.js", "SQL", "API Design", "Git"],
    });
    await storage.createJobRole({
      title: "Data Analyst (Fresher)",
      description: "Seeking a data analyst to help with reporting and insights. Proficiency in Excel, SQL, and basic Python required.",
      requiredSkills: ["SQL", "Excel", "Python", "Data Visualization"],
    });
  }

  // --- API Routes ---

  // Get Job Roles
  app.get(api.jobRoles.list.path, async (req, res) => {
    const roles = await storage.getJobRoles();
    res.json(roles);
  });

  // Get Single Job Role
  app.get(api.jobRoles.get.path, async (req, res) => {
    const role = await storage.getJobRole(Number(req.params.id));
    if (!role) {
      return res.status(404).json({ message: "Job role not found" });
    }
    res.json(role);
  });

  // Analyze Resume
  app.post(api.analyze.create.path, async (req, res) => {
    try {
      const input = api.analyze.create.input.parse(req.body);
      
      const jobRole = await storage.getJobRole(input.jobRoleId);
      if (!jobRole) {
        return res.status(404).json({ message: "Job role not found" });
      }

      // Call AI
      const aiResult = await analyzeResume(input.resumeText, jobRole.title, jobRole.description);

      // Save Result
      const analysis = await storage.createAnalysis({
        resumeText: input.resumeText,
        jobRoleId: input.jobRoleId,
        matchScore: aiResult.matchScore,
        explanation: aiResult.explanation,
        missingSkills: aiResult.missingSkills,
      });

      res.json(analysis);

    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      console.error(err);
      res.status(500).json({ message: "Internal server error during analysis" });
    }
  });

  return httpServer;
}
