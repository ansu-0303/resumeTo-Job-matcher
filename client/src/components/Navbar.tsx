import { Briefcase, Sparkles } from "lucide-react";
import { Link } from "wouter";

export function Navbar() {
  return (
    <nav className="border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group cursor-pointer">
          <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight">
            Career<span className="text-primary">Match</span>
          </span>
        </Link>
        
        <div className="flex items-center gap-6">
          <a 
            href="#how-it-works" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
          >
            How it works
          </a>
          <div className="h-4 w-px bg-border hidden sm:block" />
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Briefcase className="w-4 h-4" />
            <span>For Freshers</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
