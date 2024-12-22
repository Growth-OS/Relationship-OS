import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SubstackForm } from "@/components/substack/SubstackForm";
import { SubstackTable } from "@/components/substack/SubstackTable";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { AISidebar } from "@/components/ai-prompts/AISidebar";

const Substack = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Substack Posts</h1>
          <p className="text-gray-600">Manage your Substack blog posts</p>
        </div>
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Wand2 className="w-4 h-4" />
          AI Prompts
        </Button>
      </div>

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

      <AISidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </div>
  );
};

export default Substack;