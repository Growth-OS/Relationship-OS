import React from "react";
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

interface SidebarMenuItemProps {
  icon: LucideIcon;
  label: string;
  path: string;
  isActive: boolean;
  beta?: boolean;
}

export const SidebarMenuItem = ({ icon: Icon, label, path, isActive, beta }: SidebarMenuItemProps) => {
  return (
    <Link
      to={path}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
        isActive
          ? "bg-gray-100 text-gray-900"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
      }`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
      {beta && (
        <Badge variant="secondary" className="ml-auto text-xs">
          <Sparkles className="w-3 h-3 mr-1" />
          Beta
        </Badge>
      )}
    </Link>
  );
};