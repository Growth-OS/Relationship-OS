import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  User, 
  Users, 
  Palette, 
  Database
} from "lucide-react";

export const SettingsSidebar = () => {
  const links = [
    {
      href: "/dashboard/settings/profile",
      label: "Profile",
      icon: User
    },
    {
      href: "/dashboard/settings/team",
      label: "Team",
      icon: Users
    },
    {
      href: "/dashboard/settings/branding",
      label: "Branding",
      icon: Palette
    },
    {
      href: "/dashboard/settings/backup",
      label: "Backup",
      icon: Database
    }
  ];

  return (
    <div className="w-64 border-r bg-white p-6">
      <nav className="space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.href}
            to={link.href}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
                isActive && "bg-gray-100 text-gray-900"
              )
            }
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};