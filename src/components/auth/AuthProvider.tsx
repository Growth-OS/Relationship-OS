import { useEffect, useState } from "react";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session check error:", error);
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        setIsAuthenticated(!!session);
        setIsLoading(false);

        // Handle OAuth redirects with code parameter
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        if (code && session) {
          // Get the stored return path or default to dashboard
          const storedPath = localStorage.getItem('oauth_return_path') || '/dashboard';
          localStorage.removeItem('oauth_return_path'); // Clean up
          navigate(storedPath, { replace: true });
        }
      } catch (error) {
        console.error("Session check error:", error);
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event, !!session);
      
      if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        localStorage.clear();
        navigate('/login', { replace: true });
        toast.success('Signed out successfully');
      } else if (event === 'SIGNED_IN') {
        setIsAuthenticated(true);
        await checkSession(); // Recheck session when signed in
        // Only navigate if we're not already on a valid route
        if (location.pathname === '/login' || location.pathname === '/') {
          navigate('/dashboard', { replace: true });
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated && location.pathname !== '/login') {
    // Save the current location to redirect back after login
    const returnPath = location.pathname !== '/login' ? location.pathname : '/dashboard';
    return <Navigate to={`/login?returnTo=${returnPath}`} replace />;
  }

  return <>{children}</>;
};