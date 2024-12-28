import React from "react";
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarMenuItemProps {
  icon: LucideIcon;
  label: string;
  path: string;
  isActive: boolean;
  beta?: boolean;
  badge?: number;
}

export const SidebarMenuItem = ({ 
  icon: Icon, 
  label, 
  path, 
  isActive, 
  beta,
  badge 
}: SidebarMenuItemProps) => {
  return (
    <Link
      to={path}
      className={cn(
        "flex items-center justify-between px-4 py-2 rounded-lg transition-colors",
        isActive
          ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
      )}
    >
      <div className="flex items-center">
        <Icon className="w-5 h-5 mr-3" />
        <span>{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {badge !== undefined && (
          <Badge variant="secondary" className="bg-purple-100 text-purple-900 dark:bg-purple-900 dark:text-purple-100">
            {badge}
          </Badge>
        )}
        {beta && (
          <Badge variant="secondary" className="ml-auto text-xs">
            <Sparkles className="w-3 h-3 mr-1" />
            Beta
          </Badge>
        )}
      </div>
    </Link>
  );
};