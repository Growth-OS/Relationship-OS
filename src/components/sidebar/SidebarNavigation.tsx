import React from "react";
import { useLocation } from "react-router-dom";
import { 
  Home, Calendar, ListTodo, Users, ChartBar, Mail, 
  Briefcase, UserPlus, Euro, FolderOpen, MessageSquare,
  Bug, FileText, ChartLine, ChartPie, Database, 
  BookOpen, Plane, Target, Folder, Settings,
  Linkedin, Instagram
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
    { icon: Target, label: "Outreach Campaigns", path: "/dashboard/outreach-campaigns" },
    { icon: Briefcase, label: "Deals", path: "/dashboard/deals" },
    { icon: FolderOpen, label: "Projects", path: "/dashboard/projects" },
    { icon: Folder, label: "Templates", path: "/dashboard/templates" },
    { icon: ListTodo, label: "Tasks", path: "/dashboard/tasks" },
    { icon: Calendar, label: "Calendar", path: "/dashboard/calendar" },
    { icon: Plane, label: "Travels", path: "/dashboard/travels" },
    { 
      icon: Mail, 
      label: "Superhuman", 
      path: "https://mail.superhuman.com/patrick@relationshipofsales.com",
      external: true 
    },
    { 
      icon: Linkedin, 
      label: "LinkedIn", 
      path: "https://app.trykondo.com/inboxes/focused",
      external: true 
    },
    { 
      icon: FileText, 
      label: "Content", 
      path: "https://publish.buffer.com/create?view=board",
      external: true 
    },
    { 
      icon: Instagram,
      label: "Instagram",
      path: "https://www.instagram.com/relationshipofsales/",
      external: true
    },
    { 
      icon: BookOpen,
      label: "Substack",
      path: "/dashboard/substack"
    },
    { 
      icon: () => (
        <img 
          src="/lovable-uploads/f8837421-1e5c-4f46-9f73-c835fceeb13e.png" 
          alt="AI"
          className="w-5 h-5"
        />
      ), 
      label: "AI", 
      path: "https://chat.openai.com",
      external: true 
    },
    { icon: Users, label: "Affiliates", path: "/dashboard/affiliates" },
    { icon: Euro, label: "Finances", path: "/dashboard/finances" },
    { icon: FileText, label: "Invoices", path: "/dashboard/invoices" },
    { icon: ChartBar, label: "Reporting", path: "/dashboard/reporting" },
    { 
      icon: Bug, 
      label: "Development", 
      path: "https://lovable.dev/projects/6496a71f-82eb-448d-83e9-3f83d5ae630c",
      external: true 
    },
  ];

  return (
    <nav className="space-y-1 flex-1 flex flex-col items-center overflow-y-auto">
      <div className="space-y-1">
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