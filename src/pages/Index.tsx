import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-6">
      <h1 className="text-4xl font-bold">Welcome to Your Dashboard</h1>
      <p className="text-lg text-muted-foreground">
        Manage your tasks, projects, and more
      </p>
      <div className="flex gap-4">
        <Button onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
        <Button onClick={() => navigate("/dashboard/tasks")} variant="outline">
          View Tasks
        </Button>
      </div>
    </div>
  );
};

export default Index;