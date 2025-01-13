import { Toaster } from "@/components/ui/toaster";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-gray-900">
      <Sidebar />
      <main className="ml-64 min-h-screen transition-all duration-200 ease-in-out animate-fade-in">
        <div className="container mx-auto px-6 py-8">
          <Outlet />
        </div>
      </main>
      <Toaster />
    </div>
  );
};

export default Layout;