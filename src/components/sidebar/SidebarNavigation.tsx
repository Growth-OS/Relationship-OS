import React from "react";
import { useLocation } from "react-router-dom";
import { 
  Home, Calendar, ListTodo, Users, ChartBar, Mail, 
  Briefcase, UserPlus, Euro, FolderOpen, MessageSquare,
  Bug, FileText, ChartLine, ChartPie, Database, LayoutDashboard, 
  Sparkles, List, BookOpen, Plane
} from "lucide-react";
import { SidebarMenuItem } from "./SidebarMenuItem";

export const SidebarNavigation = () => {
  const location = useLocation();

  const isPathActive = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(path);
  };

  const mainMenuItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: UserPlus, label: "Prospects", path: "/dashboard/prospects" },
    { icon: List, label: "Sequences", path: "/dashboard/sequences" },
    { icon: Briefcase, label: "Deals", path: "/dashboard/deals" },
    { icon: FolderOpen, label: "Projects", path: "/dashboard/projects" },
    { icon: LayoutDashboard, label: "Boards", path: "/dashboard/boards" },
    { icon: ListTodo, label: "Tasks", path: "/dashboard/tasks" },
    { icon: Calendar, label: "Calendar", path: "/dashboard/calendar" },
    { icon: Plane, label: "Travels", path: "/dashboard/travels" },
    { 
      icon: Mail, 
      label: "Superhuman", 
      path: "https://mail.superhuman.com",
      external: true 
    },
    { 
      icon: MessageSquare, 
      label: "LinkedIn", 
      path: "https://app.trykondo.com/inboxes/focused",
      external: true 
    },
    { 
      icon: FileText, 
      label: "Content", 
      path: "/dashboard/content" 
    },
    { 
      icon: BookOpen,
      label: "Substack",
      path: "/dashboard/substack"
    },
    { 
      icon: Sparkles, 
      label: "AI", 
      path: "/dashboard/ai"
    },
    { icon: Users, label: "Affiliates", path: "/dashboard/affiliates" },
    { icon: Euro, label: "Finances", path: "/dashboard/finances" },
    { icon: FileText, label: "Invoices", path: "/dashboard/invoices" },
    { icon: ChartBar, label: "Reporting", path: "/dashboard/reporting" },
    { icon: Bug, label: "Development", path: "/dashboard/development" },
  ];

  return (
    <nav className="space-y-1 flex-1">
      <div className="mb-6">
        {mainMenuItems.map((item) => (
          <SidebarMenuItem
            key={item.path}
            icon={item.icon}
            label={item.label}
            path={item.path}
            isActive={!item.external && isPathActive(item.path)}
            external={item.external}
          />
        ))}
      </div>
    </nav>
  );
};