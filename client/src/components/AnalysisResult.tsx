import { Analysis, JobRole } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Trophy, BookOpen, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { useJobRoles } from "@/hooks/use-job-matcher";

interface AnalysisResultProps {
  analysis: Analysis;
}

export function AnalysisResult({ analysis }: AnalysisResultProps) {
  const { data: jobRoles } = useJobRoles();
  const jobRole = jobRoles?.find((r) => r.id === analysis.jobRoleId);

  if (!jobRole) return null;

  const scoreColor = 
    analysis.matchScore >= 80 ? "text-green-600" :
    analysis.matchScore >= 50 ? "text-yellow-600" :
    "text-red-600";
    
  const progressColor = 
    analysis.matchScore >= 80 ? "bg-green-600" :
    analysis.matchScore >= 50 ? "bg-yellow-500" :
    "bg-red-500";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Score Card */}
      <Card className="p-8 border-border/50 shadow-xl bg-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-10 -mt-10 blur-3xl" />
        
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-bold mb-2">Match Analysis for <span className="text-primary">{jobRole.title}</span></h3>
            <p className="text-muted-foreground">
              Based on the skills and experience extracted from your resume.
            </p>
          </div>
          
          <div className="flex items-center justify-center relative w-32 h-32">
             <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="60"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-muted/20"
              />
              <motion.circle
                initial={{ pathLength: 0 }}
                animate={{ pathLength: analysis.matchScore / 100 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                cx="64"
                cy="64"
                r="60"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className={scoreColor}
                strokeLinecap="round"
                strokeDasharray="377" // 2 * pi * 60
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-bold ${scoreColor}`}>{analysis.matchScore}%</span>
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Match</span>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Explanation Card */}
        <Card className="p-6 h-full border-l-4 border-l-primary shadow-lg bg-white/80">
          <h4 className="text-lg font-bold flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-primary" />
            Why You're a Match
          </h4>
          <p className="text-foreground/80 leading-relaxed whitespace-pre-line">
            {analysis.explanation}
          </p>
        </Card>

        {/* Skills Gap Card */}
        <Card className="p-6 h-full border-l-4 border-l-orange-500 shadow-lg bg-white/80">
          <h4 className="text-lg font-bold flex items-center gap-2 mb-4 text-orange-700">
            <AlertTriangle className="w-5 h-5" />
            Skills to Improve
          </h4>
          
          {analysis.missingSkills.length > 0 ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground mb-4">
                Adding these skills to your repertoire would significantly boost your match score:
              </p>
              <ul className="space-y-2">
                {analysis.missingSkills.map((skill, idx) => (
                  <motion.li 
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-start gap-2 p-2 rounded-lg bg-orange-50 text-sm font-medium text-orange-900 border border-orange-100"
                  >
                    <BookOpen className="w-4 h-4 mt-0.5 text-orange-500 shrink-0" />
                    {skill}
                  </motion.li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mb-2" />
              <p className="font-medium text-green-700">Excellent! No major skill gaps found.</p>
            </div>
          )}
        </Card>
      </div>

      <div className="flex justify-center pt-8">
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
          className="gap-2 border-primary/20 hover:border-primary/50 text-primary hover:bg-primary/5"
        >
          Analyze Another Resume
        </Button>
      </div>
    </motion.div>
  );
}
