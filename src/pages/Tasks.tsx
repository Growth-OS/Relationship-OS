import { Card } from "@/components/ui/card";
import { TaskList } from "@/components/tasks/TaskList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateTaskButton } from "@/components/tasks/CreateTaskButton";

const Tasks = () => {
  return (
    <div className="space-y-4 animate-fade-in">
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="text-left">
            <h1 className="text-2xl font-semibold text-primary mb-1">Tasks</h1>
            <p className="text-sm text-muted-foreground">
              Manage your tasks across different areas
            </p>
          </div>
          <CreateTaskButton />
        </div>
      </Card>

      <Card className="p-6">
        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="deals">Deals</TabsTrigger>
            <TabsTrigger value="sequences">Sequences</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="ideas">Ideas</TabsTrigger>
            <TabsTrigger value="substack">Substack</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>

          <TabsContent value="projects">
            <TaskList source="projects" showArchived={false} />
          </TabsContent>
          <TabsContent value="deals">
            <TaskList source="deals" showArchived={false} />
          </TabsContent>
          <TabsContent value="sequences">
            <TaskList source="sequences" showArchived={false} />
          </TabsContent>
          <TabsContent value="content">
            <TaskList source="content" showArchived={false} />
          </TabsContent>
          <TabsContent value="ideas">
            <TaskList source="ideas" showArchived={false} />
          </TabsContent>
          <TabsContent value="substack">
            <TaskList source="substack" showArchived={false} />
          </TabsContent>
          <TabsContent value="archived">
            <TaskList showArchived={true} />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Tasks;