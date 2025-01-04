import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get('returnTo') || '/dashboard';

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        toast.success('Signed in successfully');
        navigate(returnTo);
      } else if (event === 'PASSWORD_RECOVERY') {
        toast.info('Password recovery email sent');
      }
    });

    // Check for error parameter in URL (from OAuth redirects)
    const error = searchParams.get('error');
    const error_description = searchParams.get('error_description');
    if (error) {
      toast.error(error_description || 'An error occurred during sign in');
    }

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, returnTo, searchParams]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
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
                  brand: '#000000',
                  brandAccent: '#22D3EE',
                  inputBackground: '#000000',
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
              input: 'w-full px-3 py-2.5 bg-black border-gray-700 rounded-lg focus:ring-cyan-400 focus:border-cyan-400 text-white',
              label: 'text-gray-300',
              message: 'text-gray-300',
              anchor: 'text-cyan-400 hover:text-cyan-300',
            },
          }}
          theme="dark"
          providers={[]}
          localization={{
            variables: {
              sign_in: {
                email_label: 'Email address',
                password_label: 'Password',
                button_label: 'Sign in',
                loading_button_label: 'Signing in...',
                social_provider_text: 'Sign in with {{provider}}',
                link_text: "Already have an account? Sign in",
              },
              sign_up: {
                email_label: 'Email address',
                password_label: 'Create a password',
                button_label: 'Sign up',
                loading_button_label: 'Signing up...',
                social_provider_text: 'Sign up with {{provider}}',
                link_text: "Don't have an account? Sign up",
              },
            },
          }}
          authOptions={{
            onError: (error) => {
              console.error('Auth error:', error);
              if (error.message.includes('Invalid login credentials')) {
                toast.error('Invalid email or password. Please try again.');
              } else {
                toast.error(error.message);
              }
            },
          }}
        />
      </div>
    </div>
  );
};

export default Login;