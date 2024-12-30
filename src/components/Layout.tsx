import { Toaster } from "@/components/ui/toaster";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-gray-900">
      <Sidebar />
      <main className="ml-64 min-h-screen dark:bg-gray-900">
        <div className="px-4 py-6">
          {children}
        </div>
      </main>
      <Toaster />
    </div>
  );
};

export default Layout;