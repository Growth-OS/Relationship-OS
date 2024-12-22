import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SubstackForm } from "@/components/substack/SubstackForm";
import { SubstackTable } from "@/components/substack/SubstackTable";

const Substack = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">Substack Posts</h1>
        <p className="text-gray-600">Manage your Substack blog posts</p>
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
    </div>
  );
};

export default Substack;