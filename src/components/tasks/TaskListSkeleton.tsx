import { Card } from "@/components/ui/card";

export const TaskListSkeleton = () => {
  return (
    <div className="space-y-4 max-w-3xl">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="p-4 animate-pulse bg-gray-50" />
      ))}
    </div>
  );
};