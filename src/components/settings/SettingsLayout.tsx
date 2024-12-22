import { Outlet, useNavigate } from "react-router-dom";
import { SettingsSidebar } from "./SettingsSidebar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const SettingsLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 border-b bg-white">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>
      <div className="flex h-[calc(100vh-65px)]">
        <SettingsSidebar />
        <div className="flex-1 p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};