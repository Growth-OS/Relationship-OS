import React from "react";
import { useLocation } from "react-router-dom";
import { 
  Home, Calendar, ListTodo, Users, ChartBar, BookOpen, 
  Briefcase, UserPlus, Euro, FolderOpen,
  Bug, FileText, ChartLine, ChartPie, Database
} from "lucide-react";
import { SidebarMenuItem } from "./SidebarMenuItem";

export const SidebarNavigation = () => {
  const location = useLocation();

  // Function to check if a path is active, considering nested routes
  const isPathActive = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(path);
  };

  const mainMenuItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: UserPlus, label: "Prospects", path: "/dashboard/prospects" },
    { icon: Briefcase, label: "Deals", path: "/dashboard/deals" },
    { icon: FolderOpen, label: "Projects", path: "/dashboard/projects" },
    { icon: ListTodo, label: "Tasks", path: "/dashboard/tasks" },
    { icon: Calendar, label: "Calendar", path: "/dashboard/calendar" },
    { icon: BookOpen, label: "Substack", path: "/dashboard/substack" },
    { icon: Users, label: "Affiliates", path: "/dashboard/affiliates" },
    { icon: Euro, label: "Finances", path: "/dashboard/finances" },
    { icon: FileText, label: "Invoices", path: "/dashboard/invoices" },
    { icon: ChartBar, label: "Reporting", path: "/dashboard/reporting" },
    { icon: Bug, label: "Development", path: "/dashboard/development" },
  ];

  return (
    <>
      <nav className="space-y-1 flex-1">
        <div className="mb-6">
          {mainMenuItems.map((item) => (
            <SidebarMenuItem
              key={item.path}
              icon={item.icon}
              label={item.label}
              path={item.path}
              isActive={isPathActive(item.path)}
            />
          ))}
        </div>
      </nav>

      <div className="pt-4 border-t border-gray-200">
        <div className="mb-4 space-y-1">
          {externalLinks.map((item) => (
            <a
              key={item.path}
              href={item.path}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
            >
              <item.icon className="w-5 h-5 mr-3" />
              <span>{item.label}</span>
            </a>
          ))}
        </div>
      </div>
    </>
  );
};