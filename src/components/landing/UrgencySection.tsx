import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const UrgencySection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-20 bg-gradient-to-br from-blue-900 to-purple-900 text-white">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 animate-fade-in">
            You're Just Minutes Away From Transforming Your Business
          </h2>
          <div className="space-y-6 mb-12 animate-fade-in [animation-delay:200ms]">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="flex items-center gap-3 text-left bg-white/10 p-4 rounded-lg"
              >
                <Zap className="w-5 h-5 text-yellow-400 shrink-0" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
          <div className="space-y-6 animate-fade-in [animation-delay:400ms]">
            <Button 
              size="lg"
              onClick={() => navigate('/signup')}
              className="text-lg px-8 bg-white text-blue-900 hover:bg-blue-50 group"
            >
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <p className="text-sm text-blue-200">
              Not ready to commit? <button onClick={() => navigate('/demo')} className="text-white underline">Watch a demo first</button>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const benefits = [
  "Start automating your workflows in under 5 minutes",
  "See immediate improvements in productivity and efficiency",
  "Join thousands of businesses already scaling with Growth OS",
  "Risk-free 14-day trial with full access to all features"
];