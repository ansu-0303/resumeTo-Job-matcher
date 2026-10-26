import { useState } from "react";
import { useJobRoles, useAnalyzeResume } from "@/hooks/use-job-matcher";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Loader2, UploadCloud, ChevronRight, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Analysis } from "@shared/schema";
import { motion } from "framer-motion";

interface ResumeFormProps {
  onAnalysisComplete: (result: Analysis) => void;
}

export function ResumeForm({ onAnalysisComplete }: ResumeFormProps) {
  const [resumeText, setResumeText] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const { data: jobRoles, isLoading: isLoadingRoles } = useJobRoles();
  const { mutate: analyze, isPending: isAnalyzing } = useAnalyzeResume();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resumeText.trim() || resumeText.length < 50) {
      toast({
        variant: "destructive",
        title: "Resume too short",
        description: "Please paste more content from your resume (at least 50 characters).",
      });
      return;
    }

    if (!selectedRoleId) {
      toast({
        variant: "destructive",
        title: "Role required",
        description: "Please select a target job role.",
      });
      return;
    }

    analyze(
      { resumeText, jobRoleId: parseInt(selectedRoleId) },
      {
        onSuccess: (data) => {
          onAnalysisComplete(data);
          toast({
            title: "Analysis Complete",
            description: "Check out your personalized feedback below!",
          });
        },
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "Error",
            description: error.message,
          });
        },
      }
    );
  };

  return (
    <Card className="overflow-hidden border-border/50 shadow-xl shadow-primary/5 bg-white/50 backdrop-blur-sm">
      <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-transparent p-6 border-b border-border/50">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <UploadCloud className="w-5 h-5 text-primary" />
          Start Your Analysis
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Paste your resume and choose a target role to get instant feedback.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="space-y-4">
          <label className="block text-sm font-medium text-foreground">
            1. Select Target Role
          </label>
          <Select 
            value={selectedRoleId} 
            onValueChange={setSelectedRoleId}
            disabled={isLoadingRoles || isAnalyzing}
          >
            <SelectTrigger className="w-full h-12 bg-white">
              <SelectValue placeholder="Select a job role..." />
            </SelectTrigger>
            <SelectContent>
              {jobRoles?.map((role) => (
                <SelectItem key={role.id} value={role.id.toString()}>
                  {role.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-foreground">
            2. Paste Resume Content
          </label>
          <div className="relative">
            <Textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your full resume text here... (Experience, Skills, Projects, Education)"
              className="min-h-[200px] resize-none p-4 font-mono text-sm leading-relaxed bg-white focus-visible:ring-primary/20"
              disabled={isAnalyzing}
            />
            {resumeText.length > 0 && (
              <div className="absolute bottom-3 right-3 text-xs text-muted-foreground bg-white/80 px-2 py-1 rounded-md border">
                {resumeText.length} chars
              </div>
            )}
          </div>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            disabled={isAnalyzing || !resumeText || !selectedRoleId}
            className="w-full h-14 text-base font-semibold shadow-lg shadow-primary/25 transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            {isAnalyzing ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing match...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                Analyze My Resume <ChevronRight className="w-5 h-5" />
              </div>
            )}
          </Button>
          
          {isAnalyzing && (
            <motion.p 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-xs text-muted-foreground mt-4 animate-pulse"
            >
              Comparing your skills with industry standards...
            </motion.p>
          )}
        </div>
      </form>
    </Card>
  );
}
