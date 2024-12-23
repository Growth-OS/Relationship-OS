import { Card } from "@/components/ui/card";
import { TaskList } from "@/components/tasks/TaskList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Tasks = () => {
  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-primary mb-1">Tasks</h1>
        <p className="text-sm text-gray-600">Manage your tasks across different areas</p>
      </div>

      <Card className="p-6">
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Tasks</TabsTrigger>
            <TabsTrigger value="crm">CRM</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="ideas">Ideas</TabsTrigger>
            <TabsTrigger value="substack">Substack</TabsTrigger>
            <TabsTrigger value="other">Other</TabsTrigger>
          </TabsList>

          <div className="mt-4">
            <TabsContent value="all">
              <TaskList />
            </TabsContent>
            <TabsContent value="crm">
              <TaskList source="crm" />
            </TabsContent>
            <TabsContent value="content">
              <TaskList source="content" />
            </TabsContent>
            <TabsContent value="ideas">
              <TaskList source="ideas" />
            </TabsContent>
            <TabsContent value="substack">
              <TaskList source="substack" />
            </TabsContent>
            <TabsContent value="other">
              <TaskList source="other" />
            </TabsContent>
          </div>
        </Tabs>
      </Card>
    </div>
  );
};

export default Tasks;