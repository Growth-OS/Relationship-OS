import { Toaster } from "@/components/ui/toaster";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-gray-900">
      <Sidebar />
      <main className="pl-64 min-h-screen transition-all duration-200 ease-in-out animate-fade-in">
        {children}
      </main>
      <Toaster />
    </div>
  );
};

export default Layout;