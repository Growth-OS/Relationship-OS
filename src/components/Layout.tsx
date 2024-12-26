import { Toaster } from "@/components/ui/toaster";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="ml-64 w-[calc(100%-16rem)] min-h-screen">
        <div className="max-w-[1400px] mx-auto px-6 py-8">
          {children}
        </div>
      </main>
      <Toaster />
    </div>
  );
};

export default Layout;