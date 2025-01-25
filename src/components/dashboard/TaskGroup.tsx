import { Card } from "@/components/ui/card";
import { TaskCard } from "@/components/tasks/TaskCard";
import { getSourceIcon } from "@/components/tasks/utils";
import { TaskData, TaskSource } from "@/components/tasks/types";
import { Users, ChevronDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface TaskGroupProps {
  source: TaskSource;
  tasks: TaskData[];
  onComplete: (taskId: string, completed: boolean) => Promise<void>;
  onUpdate: () => Promise<void>;
}

export const TaskGroup = ({ source, tasks, onComplete, onUpdate }: TaskGroupProps) => {
  const Icon = source === 'outreach' ? Users : getSourceIcon(source);
  const sourceTitle = source === 'outreach' ? 'Outreach Tasks' : source.charAt(0).toUpperCase() + source.slice(1);

  // Sort tasks by due date (null dates at the end)
  const sortedTasks = [...tasks].sort((a, b) => {
    if (!a.due_date) return 1;
    if (!b.due_date) return -1;
    return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
  });

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-gray-600">
            <ChevronDown className="w-4 h-4 mr-2" />
            {sourceTitle}
            <span className="ml-2 text-xs bg-gray-100 px-2 py-0.5 rounded-full">
              {tasks.length}
            </span>
          </Button>
        </div>
        <Button size="sm" variant="ghost">
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="space-y-2">
        {sortedTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onComplete={onComplete}
            onUpdate={onUpdate}
          />
        ))}
      </div>
    </div>
  );
};