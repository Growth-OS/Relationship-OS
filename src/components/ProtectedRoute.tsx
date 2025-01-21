import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Auth check error:", error);
          if (mounted) {
            setIsAuthenticated(false);
            setIsLoading(false);
            toast.error("Authentication error. Please try logging in again.");
          }
          return;
        }

        if (!session) {
          console.log("No active session found");
          if (mounted) {
            setIsAuthenticated(false);
            setIsLoading(false);
            toast.error("Please log in to continue");
          }
          return;
        }

        console.log("Active session found for user:", session.user.id);
        if (mounted) {
          setIsAuthenticated(true);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        if (mounted) {
          setIsAuthenticated(false);
          setIsLoading(false);
          toast.error("Authentication error. Please try logging in again.");
        }
      }
    };

    // Initial auth check
    checkAuth();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      console.log("Auth state change:", event, !!session);
      
      if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        toast.error("Your session has ended. Please log in again.");
        return;
      }
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setIsAuthenticated(true);
        return;
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Save the current path before redirecting
    const returnPath = window.location.pathname;
    localStorage.setItem('return_path', returnPath);
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};