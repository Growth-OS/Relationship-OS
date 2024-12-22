import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import Layout from "./components/Layout";
import { SettingsLayout } from "./components/settings/SettingsLayout";
import Dashboard from "./pages/Dashboard";
import Affiliates from "./pages/Affiliates";
import Reporting from "./pages/Reporting";
import Substack from "./pages/Substack";
import AIPrompts from "./pages/AIPrompts";
import AIPersona from "./pages/AIPersona";
import ProfileSettings from "./pages/ProfileSettings";
import Login from "./pages/Login";
import { useEffect, useState } from "react";
import { supabase } from "./integrations/supabase/client";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Check current session
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session check error:", error);
          if (mounted) {
            setIsAuthenticated(false);
          }
          return;
        }

        if (mounted) {
          setIsAuthenticated(!!session);
        }
      } catch (error) {
        console.error("Session check error:", error);
        if (mounted) {
          setIsAuthenticated(false);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setIsAuthenticated(!!session);
        setIsLoading(false);
      }
    });

    // Cleanup
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Show loading state
  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            element={
              <ProtectedRoute>
                <Layout>
                  <Outlet />
                </Layout>
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Dashboard />} />
            <Route path="/affiliates" element={<Affiliates />} />
            <Route path="/reporting" element={<Reporting />} />
            <Route path="/substack" element={<Substack />} />
          </Route>
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsLayout />
              </ProtectedRoute>
            }
          >
            <Route path="profile" element={<ProfileSettings />} />
            <Route path="ai-prompts" element={<AIPrompts />} />
            <Route path="ai-persona" element={<AIPersona />} />
            <Route index element={<Navigate to="profile" replace />} />
          </Route>
        </Routes>
        <Toaster />
        <Sonner />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;