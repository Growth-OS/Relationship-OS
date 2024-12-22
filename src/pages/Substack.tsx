import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SubstackForm } from "@/components/substack/SubstackForm";
import { SubstackTable } from "@/components/substack/SubstackTable";
import { AIPromptManager } from "@/components/substack/AIPromptManager";

const Substack = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">Substack Posts</h1>
        <p className="text-gray-600">Manage your Substack blog posts</p>
      </div>

      <Tabs defaultValue="posts">
        <TabsList>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="prompts">AI Prompts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="posts" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Add New Post</CardTitle>
            </CardHeader>
            <CardContent>
              <SubstackForm />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Posts Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <SubstackTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prompts">
          <AIPromptManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Substack;