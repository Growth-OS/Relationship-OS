import React from "react";
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarMenuItemProps {
  icon: LucideIcon;
  label: string;
  path: string;
  isActive: boolean;
  beta?: boolean;
  badge?: number;
  external?: boolean;
}

export const SidebarMenuItem = ({ 
  icon: Icon, 
  label, 
  path, 
  isActive, 
  beta,
  badge,
  external 
}: SidebarMenuItemProps) => {
  const commonClasses = cn(
    "flex items-center justify-center w-9 h-9 rounded-lg transition-colors", // Reduced from w-10 h-10
    isActive
      ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white"
      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
  );

  const content = (
    <div className="relative">
      <Icon className="w-4 h-4" /> {/* Reduced from w-5 h-5 */}
      {badge !== undefined && (
        <Badge 
          variant="secondary" 
          className="absolute -top-2 -right-2 min-w-[16px] h-[16px] p-0 flex items-center justify-center bg-purple-100 text-purple-900 text-xs dark:bg-purple-900 dark:text-purple-100"
        >
          {badge}
        </Badge>
      )}
      {beta && (
        <Badge 
          variant="secondary" 
          className="absolute -top-2 -right-2 min-w-[16px] h-[16px] p-0 flex items-center justify-center"
        >
          <Sparkles className="w-3 h-3" />
        </Badge>
      )}
    </div>
  );

  const tooltipContent = (
    <TooltipContent side="right">
      <p>{label}</p>
    </TooltipContent>
  );

  if (external) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <a
              href={path}
              target="_blank"
              rel="noopener noreferrer"
              className={commonClasses}
            >
              {content}
            </a>
          </TooltipTrigger>
          {tooltipContent}
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            to={path}
            className={commonClasses}
          >
            {content}
          </Link>
        </TooltipTrigger>
        {tooltipContent}
      </Tooltip>
    </TooltipProvider>
  );
};