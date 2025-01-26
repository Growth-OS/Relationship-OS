import React from "react";
import { SidebarLogo } from "./sidebar/SidebarLogo";
import { SidebarNavigation } from "./sidebar/SidebarNavigation";
import { SidebarFooter } from "./sidebar/SidebarFooter";

const Sidebar = () => {
  return (
    <div className="w-16 h-screen bg-background border-r border-border p-2 fixed left-0 top-0 flex flex-col items-center">
      <SidebarLogo />
      <SidebarNavigation />
      <SidebarFooter />
    </div>
  );
};

export default Sidebar;