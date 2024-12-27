import React from "react";
import { SidebarLogo } from "./sidebar/SidebarLogo";
import { SidebarNavigation } from "./sidebar/SidebarNavigation";
import { SidebarFooter } from "./sidebar/SidebarFooter";

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-background border-r border-border p-4 fixed left-0 top-0 flex flex-col dark:bg-[#1A1F2C] dark:border-[#2A2F3C]">
      <SidebarLogo />
      <SidebarNavigation />
      <SidebarFooter />
    </div>
  );
};

export default Sidebar;