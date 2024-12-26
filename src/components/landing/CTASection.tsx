import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const CTASection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-20 bg-black border-t border-white/10">
      <div className="container mx-auto px-6">
        <div className="max-w-xl mx-auto text-center">
          <Button 
            onClick={() => navigate('/signup')}
            className="h-14 px-8 text-lg bg-white hover:bg-white/90 text-black group"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
          <div className="mt-8 flex items-center justify-center space-x-6 text-sm text-white/50">
            <a href="/terms" className="hover:text-white">Terms</a>
            <a href="/privacy" className="hover:text-white">Privacy</a>
          </div>
        </div>
      </div>
    </section>
  );
};