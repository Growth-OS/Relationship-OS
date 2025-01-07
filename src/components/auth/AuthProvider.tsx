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
    // Initial session check
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session check error:", error);
          setIsAuthenticated(false);
          return;
        }

        // If no session, clear local storage and set as not authenticated
        if (!session) {
          localStorage.clear();
          setIsAuthenticated(false);
          return;
        }

        setIsAuthenticated(true);
      } catch (error) {
        console.error("Session check error:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Set up auth state change subscription
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
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
            const returnPath = localStorage.getItem('return_path') || '/dashboard';
            localStorage.removeItem('return_path');
            if (location.pathname === '/login') {
              navigate(returnPath, { replace: true });
            }
          } else {
            setIsAuthenticated(false);
            navigate('/login', { replace: true });
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

        case 'USER_DELETED':
        case 'TOKEN_REVOKED':
          setIsAuthenticated(false);
          localStorage.clear();
          navigate('/login', { replace: true });
          break;
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

  // Save the current path before redirecting to login
  if (!isAuthenticated && location.pathname !== '/login') {
    const returnPath = location.pathname !== '/login' ? location.pathname : '/dashboard';
    localStorage.setItem('return_path', returnPath);
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};