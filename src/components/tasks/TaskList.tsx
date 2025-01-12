import { TaskGroup } from "@/components/dashboard/TaskGroup";
import { TaskListSkeleton } from "./TaskListSkeleton";
import { TaskPagination } from "./TaskPagination";
import { TaskData, TaskListProps, TaskSource } from "./types";
import { useTaskQuery } from "./hooks/useTaskQuery";
import { useTaskOperations } from "./hooks/useTaskOperations";
import { ListTodo } from "lucide-react";

export const TaskList = ({ 
  sourceType, 
  sourceId, 
  showPagination = true,
  groupBySource = true,
  showArchived = false 
}: TaskListProps) => {
  const { data, isLoading } = useTaskQuery({ sourceType, sourceId, showArchived });
  const { handleTaskComplete, handleTaskUpdate } = useTaskOperations();

  if (isLoading) return <TaskListSkeleton />;
  
  if (!data?.tasks.length) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-50 rounded-lg">
        <ListTodo className="h-12 w-12 text-gray-400 mb-2" />
        <p className="text-gray-500">No tasks found</p>
      </div>
    );
  }

  if (!groupBySource) {
    const source = sourceType || "other";
    return (
      <TaskGroup 
        source={source as TaskSource} 
        tasks={data.tasks}
        onComplete={(taskId, completed) => handleTaskComplete(taskId, completed)}
        onUpdate={handleTaskUpdate}
      />
    );
  }

  const groupedTasks = data.tasks.reduce((acc, task) => {
    const taskSource = task.source || "other";
    if (!acc[taskSource as TaskSource]) {
      acc[taskSource as TaskSource] = [];
    }
    acc[taskSource as TaskSource].push(task);
    return acc;
  }, {} as Record<TaskSource, TaskData[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedTasks).map(([taskSource, tasks]) => (
        <TaskGroup
          key={taskSource}
          source={taskSource as TaskSource}
          tasks={tasks}
          onComplete={(taskId, completed) => handleTaskComplete(taskId, completed)}
          onUpdate={handleTaskUpdate}
        />
      ))}
      {showPagination && data.total > 0 && (
        <TaskPagination 
          currentPage={1} 
          totalPages={Math.ceil(data.total / 10)}
          onPageChange={() => {}}
        />
      )}
    </div>
  );
};