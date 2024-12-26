import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export const HeroSection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="pt-32 pb-20 bg-black">
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white max-w-4xl mx-auto leading-tight">
          Your All-in-One Business Growth Platform
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto">
          Streamline your business operations with integrated tools for CRM, content, finances, and task management.
        </p>
        <div className="max-w-md mx-auto space-y-4">
          <Button 
            className="w-full h-14 text-lg bg-white hover:bg-white/90 text-black group"
            onClick={() => navigate('/signup')}
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
          <p className="text-sm text-gray-500">
            Try Growth OS free for 14 days, no credit card required.
          </p>
        </div>
      </div>
    </section>
  );
};