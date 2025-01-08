import { Outlet, useNavigate } from "react-router-dom";
import { SettingsSidebar } from "./SettingsSidebar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const SettingsLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="p-4 border-b bg-white dark:bg-gray-800">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>
      <div className="flex h-[calc(100vh-65px)]">
        <SettingsSidebar />
        <div className="flex-1 p-8 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default SettingsLayout;