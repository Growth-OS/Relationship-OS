import { Toaster } from "@/components/ui/toaster";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex min-h-screen bg-[#FAFAFA] dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 transition-all duration-200 ease-in-out animate-fade-in">
        <div className="container mx-auto px-6 py-8">
          {children}
        </div>
      </main>
      <Toaster />
    </div>
  );
};

export default Layout;