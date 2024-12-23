import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { CreateTaskForm } from "./CreateTaskForm";
import { MoreHorizontal, Pencil, Check, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Task {
  id: string;
  title: string;
  description?: string;
  due_date?: string;
  completed: boolean;
  priority: string;
  source: string;
  source_id?: string;
}

interface TaskListProps {
  source?: 'crm' | 'content' | 'ideas' | 'substack' | 'other';
  showArchived?: boolean;
}

export const TaskList = ({ source, showArchived = false }: TaskListProps) => {
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  const { data: tasks = [], isLoading, refetch } = useQuery({
    queryKey: ['tasks', source, showArchived],
    queryFn: async () => {
      const query = supabase
        .from('tasks')
        .select('*')
        .eq('completed', showArchived)
        .order('due_date', { ascending: true });
      
      if (source) {
        query.eq('source', source);
      }
      
      const { data, error } = await query;
      
      if (error) {
        toast.error('Error loading tasks');
        throw error;
      }
      return data as Task[];
    },
  });

  const toggleTaskCompletion = async (taskId: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ completed })
        .eq('id', taskId);

      if (error) throw error;
      
      toast.success(completed ? 'Task archived' : 'Task restored');
      refetch();
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Error updating task');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return <div>Loading tasks...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tasks.map((task) => (
        <Card key={task.id} className="p-4 group">
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <Checkbox
                checked={task.completed}
                onCheckedChange={(checked) => toggleTaskCompletion(task.id, checked as boolean)}
              />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
                    {task.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditingTask(task)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleTaskCompletion(task.id, !task.completed)}>
                          {task.completed ? (
                            <>
                              <X className="mr-2 h-4 w-4" />
                              Restore Task
                            </>
                          ) : (
                            <>
                              <Check className="mr-2 h-4 w-4" />
                              Archive Task
                            </>
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                {task.description && (
                  <p className="text-sm text-gray-600 mt-2">{task.description}</p>
                )}
                {task.due_date && (
                  <p className="text-xs text-gray-500 mt-2">
                    Due: {format(new Date(task.due_date), 'PPP')}
                  </p>
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}
      {tasks.length === 0 && (
        <div className="col-span-full text-center text-gray-500 py-8">
          {showArchived ? 'No archived tasks' : 'No active tasks'}
        </div>
      )}

      <Dialog open={!!editingTask} onOpenChange={(open) => !open && setEditingTask(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          {editingTask && (
            <CreateTaskForm
              onSuccess={() => {
                setEditingTask(null);
                refetch();
                toast.success('Task updated successfully');
              }}
              initialData={editingTask}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};