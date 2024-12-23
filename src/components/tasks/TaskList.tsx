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
}

export const TaskList = ({ source }: TaskListProps) => {
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  const { data: tasks = [], isLoading, refetch } = useQuery({
    queryKey: ['tasks', source],
    queryFn: async () => {
      const query = supabase
        .from('tasks')
        .select('*')
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
      
      toast.success('Task updated successfully');
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
    <div className="space-y-2">
      {tasks.map((task) => (
        <Card key={task.id} className="p-4">
          <div className="flex items-start gap-3">
            <Checkbox
              checked={task.completed}
              onCheckedChange={(checked) => toggleTaskCompletion(task.id, checked as boolean)}
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
                    {task.title}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingTask(task)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Edit
                  </Button>
                </div>
                <Badge variant="secondary" className={getPriorityColor(task.priority)}>
                  {task.priority}
                </Badge>
              </div>
              {task.description && (
                <p className="text-sm text-gray-600 mt-1">{task.description}</p>
              )}
              {task.due_date && (
                <p className="text-xs text-gray-500 mt-2">
                  Due: {format(new Date(task.due_date), 'PPP')}
                </p>
              )}
            </div>
          </div>
        </Card>
      ))}
      {tasks.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No tasks found
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