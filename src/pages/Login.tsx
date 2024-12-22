import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

const Login = () => {
  const navigate = useNavigate();

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
            <p className="text-xl">
              Your all-in-one platform for <span className="text-cyan-400">content creation</span> and <span className="text-cyan-400">growth management</span>
            </p>
            <div className="prose prose-invert">
              <p className="text-gray-300">
                Growth OS helps you streamline your content creation process, manage affiliate partnerships, and track your growth metrics all in one place. From ideation to publication, we've got you covered.
              </p>
              <h3>Key Features:</h3>
              <ul className="text-gray-300">
                <li>Integrated content calendar and management</li>
                <li>AI-powered content generation</li>
                <li>Affiliate program tracking</li>
                <li>Performance analytics and reporting</li>
                <li>Task management system</li>
              </ul>
              <div className="mt-8">
                <p className="text-gray-300">
                  Join creators and businesses who use Growth OS to scale their content operations and drive sustainable growth.
                </p>
              </div>
              <div className="mt-auto pt-8">
                <p className="text-sm text-gray-400">
                  Powered by Growth OS - Your Growth Partner
                </p>
              </div>
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
            providers={["github", "google"]}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;