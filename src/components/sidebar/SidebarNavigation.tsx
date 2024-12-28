import React from "react";
import { useLocation } from "react-router-dom";
import { Home, Calendar, Edit, ListTodo, Users, ChartBar, BookOpen, Briefcase, UserPlus, Inbox, Euro, FolderOpen } from "lucide-react";
import { SidebarMenuItem } from "./SidebarMenuItem";

export const SidebarNavigation = () => {
  const location = useLocation();
  
  const mainMenuItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: Calendar, label: "Calendar", path: "/dashboard/calendar" },
    { icon: UserPlus, label: "Prospects", path: "/dashboard/prospects" },
    { icon: Briefcase, label: "Deals", path: "/dashboard/deals" },
    { icon: FolderOpen, label: "Projects", path: "/dashboard/projects" },
    { icon: ListTodo, label: "Tasks", path: "/dashboard/tasks" },
    { icon: BookOpen, label: "Substack", path: "/dashboard/substack" },
    { icon: Users, label: "Affiliates", path: "/dashboard/affiliates" },
    { icon: Euro, label: "Finances", path: "/dashboard/finances" },
    { icon: ChartBar, label: "Reporting", path: "/dashboard/reporting" },
  ];

  const betaFeatures = [
    { 
      icon: Inbox, 
      label: "Inbox", 
      path: "/dashboard/inbox",
      beta: true
    },
    { 
      icon: Edit,
      label: "LinkedIn Content",
      path: "/dashboard/content",
      beta: true
    }
  ];

  return (
    <>
      <nav className="space-y-1 flex-1">
        {mainMenuItems.map((item) => (
          <SidebarMenuItem
            key={item.path}
            {...item}
            isActive={location.pathname === item.path}
          />
        ))}
      </nav>

      <div className="pt-4 border-t border-gray-200">
        <div className="mb-4 space-y-1">
          {betaFeatures.map((item) => (
            <SidebarMenuItem
              key={item.path}
              {...item}
              isActive={location.pathname === item.path}
            />
          ))}
        </div>
      </div>
    </>
  );
};