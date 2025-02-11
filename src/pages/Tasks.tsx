import { Card } from "@/components/ui/card";
import { TaskList } from "@/components/tasks/TaskList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateTaskButton } from "@/components/tasks/CreateTaskButton";

const Tasks = () => {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="relative overflow-hidden rounded-lg bg-[#161e2c] border border-gray-800/40 shadow-sm">
        <div className="relative z-10 px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="text-left">
              <h1 className="text-2xl font-medium text-white">Tasks</h1>
              <p className="text-sm text-gray-300 mt-1">
                Manage your tasks across different areas
              </p>
            </div>
            <CreateTaskButton />
          </div>
        </div>
      </div>

      <Card className="p-6">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Tasks</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="deals">Deals</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="ideas">Ideas</TabsTrigger>
            <TabsTrigger value="substack">Substack</TabsTrigger>
            <TabsTrigger value="outreach">Outreach</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <TaskList groupBySource={true} />
          </TabsContent>
          <TabsContent value="projects">
            <TaskList sourceType="projects" />
          </TabsContent>
          <TabsContent value="deals">
            <TaskList sourceType="deals" />
          </TabsContent>
          <TabsContent value="content">
            <TaskList sourceType="content" />
          </TabsContent>
          <TabsContent value="ideas">
            <TaskList sourceType="ideas" />
          </TabsContent>
          <TabsContent value="substack">
            <TaskList sourceType="substack" />
          </TabsContent>
          <TabsContent value="outreach">
            <TaskList sourceType="outreach" />
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