import { ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const HeroSection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="pt-32 pb-20 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full mb-6 animate-fade-in">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-medium">Supercharge your business growth</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 animate-fade-in [animation-delay:200ms]">
            Transform Your Business Growth With AI-Powered Automation
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-fade-in [animation-delay:400ms]">
            The all-in-one platform that helps you automate your business operations, 
            track growth metrics, and scale faster with artificial intelligence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in [animation-delay:600ms]">
            <Button 
              size="lg"
              onClick={() => navigate('/signup')}
              className="text-lg px-8 bg-blue-600 hover:bg-blue-700 text-white group"
            >
              Start Your Growth Journey
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => navigate('/demo')}
              className="text-lg px-8 hover:bg-blue-50"
            >
              Watch Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};