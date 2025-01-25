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
    let mounted = true;

    // Initial session check
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session check error:", error);
          if (mounted) {
            setIsAuthenticated(false);
            setIsLoading(false);
          }
          return;
        }

        if (mounted) {
          setIsAuthenticated(!!session);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Session check error:", error);
        if (mounted) {
          setIsAuthenticated(false);
          setIsLoading(false);
        }
      }
    };

    checkSession();

    // Set up auth state change subscription
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      console.log("Auth state change:", event, !!session);

      switch (event) {
        case 'SIGNED_OUT':
          setIsAuthenticated(false);
          localStorage.clear();
          navigate('/login', { replace: true });
          toast.success('Signed out successfully');
          break;

        case 'SIGNED_IN':
          if (session) {
            setIsAuthenticated(true);
            // Only redirect if we're on the login page
            if (location.pathname === '/login') {
              const returnPath = localStorage.getItem('return_path') || '/dashboard';
              localStorage.removeItem('return_path');
              navigate(returnPath, { replace: true });
            }
          }
          break;

        case 'TOKEN_REFRESHED':
          if (session) {
            setIsAuthenticated(true);
            console.log('Session token refreshed');
          }
          break;

        case 'USER_UPDATED':
          if (session) {
            setIsAuthenticated(true);
            toast.success('Your profile has been updated');
          }
          break;
      }
    });

    return () => {
      mounted = false;
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

  // Save the current path before redirecting to login
  if (!isAuthenticated && location.pathname !== '/login') {
    localStorage.setItem('return_path', location.pathname);
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};