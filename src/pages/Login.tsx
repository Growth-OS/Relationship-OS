import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate("/dashboard");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#1A1F2C] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2 mb-8">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">G</span>
            </div>
            <span className="text-xl font-bold text-white">Growth OS</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Welcome back
          </h2>
          <p className="text-gray-400">
            Sign in to your account to continue
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
  );
};

export default Login;