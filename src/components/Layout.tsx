import { Toaster } from "@/components/ui/toaster";
import Sidebar from "./Sidebar";
import { useLocation } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const isProjectDetail = location.pathname.match(/^\/dashboard\/projects\/[a-zA-Z0-9-]+$/);

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-gray-900">
      <Sidebar />
      <main className={`${isProjectDetail ? '' : 'container px-6'} pl-64 min-h-screen transition-all duration-200 ease-in-out animate-fade-in`}>
        {children}
      </main>
      <Toaster />
    </div>
  );
};

export default Layout;