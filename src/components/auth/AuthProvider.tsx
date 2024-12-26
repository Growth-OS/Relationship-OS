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

        if (!session) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        setIsAuthenticated(true);
        setIsLoading(false);

        // Handle OAuth redirects
        const isOAuthRedirect = location.hash.includes('access_token') || 
                              location.hash.includes('error') || 
                              location.search.includes('code');
        
        if (isOAuthRedirect) {
          navigate('/dashboard', { replace: true });
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
      
      if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        setIsAuthenticated(false);
        navigate('/login', { replace: true });
        toast.success('Signed out successfully');
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session) {
          setIsAuthenticated(true);
          if (location.pathname === '/login') {
            navigate('/dashboard', { replace: true });
          }
        } else {
          setIsAuthenticated(false);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location]);

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    // Save the current location to redirect back after login
    const returnPath = location.pathname !== '/login' ? location.pathname : '/dashboard';
    return <Navigate to={`/login?returnTo=${returnPath}`} replace />;
  }

  return <>{children}</>;
};