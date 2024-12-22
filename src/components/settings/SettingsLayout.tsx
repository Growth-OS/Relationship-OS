import { Outlet } from "react-router-dom";
import { SettingsSidebar } from "./SettingsSidebar";

export const SettingsLayout = () => {
  return (
    <div className="flex h-full">
      <SettingsSidebar />
      <div className="flex-1 p-8">
        <Outlet />
      </div>
    </div>
  );
};