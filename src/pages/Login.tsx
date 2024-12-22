import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
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
  const [currentDescription, setCurrentDescription] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDescription((prev) => (prev + 1) % descriptions.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

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
      <div className="hidden lg:flex w-1/2 bg-[#0D2C3B] text-white p-12">
        <ScrollArea className="h-full w-full pr-4">
          <div className="space-y-8">
            <h1 className="text-4xl font-bold leading-tight">
              Welcome to Growth OS
            </h1>
            
            <div className="h-16"> {/* Fixed height container for smooth transitions */}
              <p className="text-2xl font-medium transition-all duration-500 ease-in-out">
                {descriptions[currentDescription]}
              </p>
            </div>

            <div className="prose prose-invert">
              <p className="text-gray-300">
                Streamline your content creation, manage your growth, and scale your business with our integrated platform.
              </p>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Right side with auth UI */}
      <div className="w-full lg:w-1/2 bg-[#1A1F2C] flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
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
                container: 'w-full',
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