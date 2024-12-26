import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const CTASection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-20 bg-white border-t border-gray-100">
      <div className="container mx-auto px-6">
        <div className="max-w-xl mx-auto text-center">
          <Button 
            onClick={() => navigate('/signup')}
            className="h-12 px-8 text-lg bg-black hover:bg-gray-800 text-white"
          >
            Start free trial
          </Button>
          <div className="mt-8 flex items-center justify-center space-x-6 text-sm text-gray-500">
            <a href="/terms" className="hover:text-gray-800">Terms of Service</a>
            <a href="/privacy" className="hover:text-gray-800">Privacy Policy</a>
          </div>
        </div>
      </div>
    </section>
  );
};