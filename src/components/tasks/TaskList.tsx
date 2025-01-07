import { TaskGroup } from "@/components/dashboard/TaskGroup";
import { TaskListSkeleton } from "./TaskListSkeleton";
import { EmptyTaskList } from "./EmptyTaskList";
import { TaskPagination } from "./TaskPagination";
import { TaskData, TaskListProps } from "./types";
import { useTaskQuery } from "./hooks/useTaskQuery";
import { useTaskOperations } from "./hooks/useTaskOperations";

export const TaskList = ({ 
  sourceType, 
  sourceId, 
  showPagination = true,
  groupBySource = true,
  showArchived = false 
}: TaskListProps) => {
  const { data, isLoading } = useTaskQuery({ sourceType, sourceId, showArchived });
  const { handleComplete, handleUpdate } = useTaskOperations();

  if (isLoading) return <TaskListSkeleton />;
  if (!data?.tasks.length) return <EmptyTaskList />;

  if (!groupBySource) {
    const source = sourceType || "other";
    return (
      <TaskGroup 
        source={source} 
        tasks={data.tasks}
        onComplete={handleComplete}
        onUpdate={handleUpdate}
      />
    );
  }

  const groupedTasks = data.tasks.reduce((acc, task) => {
    const taskSource = task.source || "other";
    if (!acc[taskSource]) {
      acc[taskSource] = [];
    }
    acc[taskSource].push(task);
    return acc;
  }, {} as Record<string, TaskData[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedTasks).map(([taskSource, tasks]) => (
        <TaskGroup
          key={taskSource}
          source={taskSource}
          tasks={tasks}
          onComplete={handleComplete}
          onUpdate={handleUpdate}
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