import React from "react";
import { SidebarLogo } from "./sidebar/SidebarLogo";
import { SidebarNavigation } from "./sidebar/SidebarNavigation";
import { SidebarFooter } from "./sidebar/SidebarFooter";

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-black border-r border-white/10 p-4 fixed left-0 top-0 flex flex-col">
      <SidebarLogo />
      <SidebarNavigation />
      <SidebarFooter />
    </div>
  );
};

export default Sidebar;