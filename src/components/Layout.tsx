import { Toaster } from "@/components/ui/toaster";
import Sidebar from "./Sidebar";
import { ChatSidebar } from "./chat/ChatSidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-gray-900">
      <Sidebar />
      <main className="ml-64 min-h-screen transition-all duration-200 ease-in-out animate-fade-in">
        <div className="container mx-auto px-6 py-8">
          {children}
        </div>
      </main>
      <ChatSidebar />
      <Toaster />
    </div>
  );
};

export default Layout;