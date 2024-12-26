import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const CTASection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 animate-fade-in">
            You're One Step Away From Transforming Your Business
          </h2>
          <p className="text-xl mb-8 text-blue-100 animate-fade-in [animation-delay:200ms]">
            Join thousands of businesses scaling their growth with Growth OS
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in [animation-delay:400ms]">
            <Button 
              size="lg"
              onClick={() => navigate('/signup')}
              className="text-lg px-8 bg-white text-blue-600 hover:bg-blue-50 group"
            >
              Start Free Trial
              <ArrowUpRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => navigate('/demo')}
              className="text-lg px-8 border-white text-white hover:bg-blue-700"
            >
              Schedule Demo
            </Button>
          </div>
          <p className="mt-6 text-sm text-blue-100 animate-fade-in [animation-delay:600ms]">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
};