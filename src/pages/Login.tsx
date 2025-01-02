import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get('returnTo') || '/dashboard';

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate(returnTo);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, returnTo]);

  return (
    <div className="min-h-screen bg-[#222632] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="flex flex-col items-center justify-center mb-8">
            <img 
              src="/lovable-uploads/673a2307-b663-4a8c-bd7a-77a6f37cd05c.png"
              alt="Relationship OS Logo"
              className="h-24 w-auto"
            />
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
                  brand: '#222632',
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