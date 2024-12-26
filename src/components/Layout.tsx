import { Toaster } from "@/components/ui/toaster";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      <main className="ml-64 p-8 relative">
        {children}
      </main>
      <Toaster />
    </div>
  );
};

export default Layout;