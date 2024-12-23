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

        // If this is an OAuth redirect and we have a session, navigate back to inbox
        const isOAuthRedirect = location.hash.includes('access_token') || 
                              location.hash.includes('error') || 
                              location.search.includes('code');
        
        if (isOAuthRedirect && session) {
          navigate('/dashboard/inbox', { replace: true });
        }
      } catch (error) {
        console.error("Session check error:", error);
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state change:", event, !!session);
      
      if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        navigate('/', { replace: true });
      } else if (event === 'SIGNED_IN') {
        setIsAuthenticated(true);
        // Only navigate on explicit sign in events, not on session recovery
        if (window.location.pathname === '/login') {
          navigate('/dashboard', { replace: true });
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
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};