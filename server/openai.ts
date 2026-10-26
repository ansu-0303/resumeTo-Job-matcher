import OpenAI from "openai";

// Initialize OpenAI client using Replit AI Integrations environment variables
const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export interface MatchResult {
  matchScore: number;
  explanation: string;
  missingSkills: string[];
}

export async function analyzeResume(resumeText: string, jobRoleTitle: string, jobRoleDescription: string): Promise<MatchResult> {
  const prompt = `
    You are an expert HR AI. Analyze the following resume text against the job role "${jobRoleTitle}".
    
    Job Description:
    ${jobRoleDescription}

    Resume Text:
    ${resumeText}

    Provide a JSON response with the following fields:
    - matchScore: a number between 0 and 100 indicating the fit.
    - explanation: a concise paragraph (max 3 sentences) explaining the score and fit.
    - missingSkills: an array of strings listing key skills missing from the resume that are required for the role.

    Return ONLY the JSON.
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5.1",
      messages: [
        { role: "system", content: "You are a helpful HR assistant that outputs JSON." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content received from AI");
    }

    const result = JSON.parse(content);
    return {
      matchScore: result.matchScore || 0,
      explanation: result.explanation || "Could not analyze.",
      missingSkills: result.missingSkills || [],
    };
  } catch (error) {
    console.error("OpenAI analysis error:", error);
    throw new Error("Failed to analyze resume");
  }
}
