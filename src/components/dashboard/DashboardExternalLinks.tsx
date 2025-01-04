import { Card } from "@/components/ui/card";
import { Calendar, Mail, Linkedin, Sparkles, Plus, FileText } from "lucide-react";
import { CreateTaskButton } from "@/components/tasks/CreateTaskButton";

export const DashboardExternalLinks = () => {
  const links = [
    {
      icon: Calendar,
      label: "Calendar",
      href: "https://calendar.google.com",
    },
    {
      icon: Mail,
      label: "Superhuman",
      href: "https://mail.superhuman.com/patrick@relationshipofsales.com",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      href: "https://app.trykondo.com/inboxes/focused",
    },
    {
      icon: FileText,
      label: "Content",
      href: "https://publish.buffer.com/create?view=board",
    },
    {
      icon: Sparkles,
      label: "AI",
      href: "https://chat.openai.com",
    },
  ];

  return (
    <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Quick Links</h2>
      <div className="grid grid-cols-2 gap-4">
        {links.map((link, index) => {
          const Icon = link.icon;
          return (
            <a
              key={index}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">{link.label}</span>
            </a>
          );
        })}
        <CreateTaskButton 
          variant="ghost" 
          className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors w-full justify-start"
        >
          <Plus className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">Create Task</span>
        </CreateTaskButton>
      </div>
    </Card>
  );
};