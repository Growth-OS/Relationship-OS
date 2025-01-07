import React from "react";
import { SidebarLogo } from "./sidebar/SidebarLogo";
import { SidebarNavigation } from "./sidebar/SidebarNavigation";
import { SidebarFooter } from "./sidebar/SidebarFooter";
import { ChatSidebar } from "./chat/ChatSidebar";

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-background border-r border-border p-4 fixed left-0 top-0 flex flex-col">
      <SidebarLogo />
      <SidebarNavigation />
      <div className="flex-1">
        <ChatSidebar />
      </div>
      <SidebarFooter />
    </div>
  );
};

export default Sidebar;