import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, Users, CalendarDays, Target, 
  Building2, Wallet, PieChart, Code2, FileText,
  MessageSquare, Plane, Settings
} from "lucide-react";

export const SidebarNavigation = () => {
  const location = useLocation();
  
  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard
    },
    {
      name: "Prospects",
      href: "/dashboard/prospects",
      icon: Users
    },
    {
      name: "Chat Rooms",
      href: "/dashboard/chat",
      icon: MessageSquare
    },
    {
      name: "Calendar",
      href: "/dashboard/calendar",
      icon: CalendarDays
    },
    {
      name: "Tasks",
      href: "/dashboard/tasks",
      icon: Target
    },
    {
      name: "Deals",
      href: "/dashboard/deals",
      icon: Building2
    },
    {
      name: "Projects",
      href: "/dashboard/projects",
      icon: Wallet
    },
    {
      name: "Reports",
      href: "/dashboard/reports",
      icon: PieChart
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: Settings
    },
    // Add other navigation items as needed
  ];

  return (
    <nav className="space-y-1">
      {navigation.map((item) => {
        const isActive = location.pathname === item.href;
        return (
          <Link
            key={item.name}
            to={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
              isActive 
                ? "bg-accent text-accent-foreground" 
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
};
