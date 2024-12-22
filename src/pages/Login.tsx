import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

const descriptions = [
  "Growth OS is your all-in-one content creation platform",
  "Growth OS is your personal growth assistant",
  "Growth OS is your content management system",
  "Growth OS is your affiliate program tracker",
  "Growth OS is your AI-powered writing companion",
  "Growth OS is your business growth toolkit",
];

const Login = () => {
  const navigate = useNavigate();
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  const typeText = useCallback(() => {
    const targetText = descriptions[currentIndex];
    
    if (isTyping) {
      if (currentText.length < targetText.length) {
        setCurrentText(targetText.slice(0, currentText.length + 1));
      } else {
        setIsTyping(false);
        setTimeout(() => {
          setIsTyping(true);
          setCurrentText("");
          setCurrentIndex((prev) => (prev + 1) % descriptions.length);
        }, 2000);
      }
    }
  }, [currentText, currentIndex, isTyping]);

  useEffect(() => {
    const interval = setInterval(typeText, 50);
    return () => clearInterval(interval);
  }, [typeText]);

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/");
      }
    });
  }, [navigate]);

  return (
    <div className="flex min-h-screen">
      {/* Left side with scrollable content */}
      <div className="hidden lg:flex w-1/2 bg-[#0D2C3B] text-white">
        <ScrollArea className="h-full w-full">
          <div className="flex flex-col justify-center items-center min-h-screen p-12 text-center">
            <h1 className="text-4xl font-bold leading-tight mb-8">
              Welcome to Growth OS
            </h1>
            
            <div className="h-16 flex items-center justify-center w-full">
              <p className="text-2xl font-medium">
                {currentText}
                <span className="animate-pulse">|</span>
              </p>
            </div>

            <div className="prose prose-invert mt-8 max-w-xl mx-auto">
              <p className="text-gray-300">
                Streamline your content creation, manage your growth, and scale your business with our integrated platform.
              </p>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Right side with auth UI */}
      <div className="w-full lg:w-1/2 bg-[#1A1F2C] flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8 relative z-10">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-white">
              Access Your Growth OS Dashboard
            </h2>
            <p className="text-gray-400">
              Sign in to manage your content ecosystem
            </p>
          </div>

          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#0D2C3B',
                    brandAccent: '#22D3EE',
                    inputBackground: '#222632',
                    inputText: '#FFFFFF',
                    inputPlaceholder: '#666666',
                    messageText: '#FFFFFF',
                    messageTextDanger: '#FF4444',
                    anchorTextColor: '#22D3EE',
                    dividerBackground: '#333333',
                  },
                },
              },
              className: {
                container: 'relative z-20',
                button: 'w-full px-4 py-2.5 rounded-lg font-medium',
                input: 'w-full px-3 py-2.5 bg-[#222632] border-gray-700 rounded-lg focus:ring-cyan-400 focus:border-cyan-400 text-white',
                label: 'text-gray-300',
                message: 'text-gray-300',
                anchor: 'text-cyan-400 hover:text-cyan-300',
              },
            }}
            theme="dark"
            providers={[]}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;