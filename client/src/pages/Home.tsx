import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { ResumeForm } from "@/components/ResumeForm";
import { AnalysisResult } from "@/components/AnalysisResult";
import { Analysis } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [result, setResult] = useState<Analysis | null>(null);

  const handleAnalysisComplete = (data: Analysis) => {
    setResult(data);
    // Smooth scroll to results
    setTimeout(() => {
      document.getElementById("results-section")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/50 via-white to-blue-50/50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        
        {/* Hero Section */}
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-6xl font-display font-extrabold text-foreground tracking-tight mb-4">
              Is your resume ready for <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                your dream job?
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Get instant, AI-powered feedback on your resume. Compare your skills against real job requirements and bridge the gap to your first career role.
            </p>
          </motion.div>
        </div>

        <div className={result ? "grid lg:grid-cols-12 gap-12 items-start" : "flex justify-center"}>
          {/* Left Column: Form */}
          <motion.div 
            className={result ? "lg:col-span-5" : "w-full max-w-2xl"}
            layout
          >
            <ResumeForm onAnalysisComplete={handleAnalysisComplete} />
          </motion.div>

          {/* Right Column: Results (Only shows when available) */}
          <AnimatePresence>
            {result && (
              <motion.div 
                id="results-section"
                className="lg:col-span-7"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <AnalysisResult analysis={result} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* How it works section */}
        {!result && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            id="how-it-works"
            className="mt-32 pt-16 border-t border-border/50"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">How CareerMatch Works</h2>
              <p className="text-muted-foreground">Three simple steps to improve your job prospects</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Select a Role",
                  desc: "Choose from common fresher roles like Software Engineer, Data Analyst, or Product Designer."
                },
                {
                  step: "02",
                  title: "Paste Resume",
                  desc: "Copy the content of your resume. Don't worry about formatting, our AI understands text."
                },
                {
                  step: "03",
                  title: "Get Feedback",
                  desc: "Receive an instant match score and actionable advice on skills you need to learn."
                }
              ].map((item, i) => (
                <div key={i} className="relative p-6 rounded-2xl bg-white border border-border shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-6xl font-display font-bold text-slate-100 absolute top-4 right-4 -z-10">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 bg-white/50 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>© {new Date().getFullYear()} CareerMatch. Built to help freshers launch their careers.</p>
        </div>
      </footer>
    </div>
  );
}
