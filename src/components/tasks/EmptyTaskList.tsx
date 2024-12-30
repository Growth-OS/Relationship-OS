import { ListTodo } from "lucide-react";

export const EmptyTaskList = () => {
  return (
    <div className="text-center py-12 bg-gray-50 rounded-lg max-w-3xl">
      <ListTodo className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <p className="text-gray-500">No tasks found</p>
    </div>
  );
};