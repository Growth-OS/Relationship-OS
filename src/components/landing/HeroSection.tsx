import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

export const HeroSection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="pt-20 pb-32 bg-white text-center">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="w-16 h-16 mx-auto mb-8 bg-black rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-2xl">G</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-black">
          Scale your business with Growth OS
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-12">
          Trusted by over 10,000 businesses worldwide
        </p>
        <div className="max-w-md mx-auto space-y-4">
          <Input 
            type="email" 
            placeholder="Enter your email address"
            className="h-12 text-lg"
          />
          <Button 
            className="w-full h-12 text-lg bg-black hover:bg-gray-800 text-white"
            onClick={() => navigate('/signup')}
          >
            Start free trial
          </Button>
          <p className="text-sm text-gray-500">
            Try Growth OS free for 14 days, no credit card required. By entering your email,
            you agree to receive marketing emails from Growth OS.
          </p>
        </div>
      </div>
    </section>
  );
};