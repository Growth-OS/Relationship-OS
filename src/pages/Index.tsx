import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="container mx-auto p-8 animate-fade-in">
      <Card className="p-6">
        <h1 className="text-3xl font-bold mb-4">Welcome to Your Dashboard</h1>
        <p className="text-muted-foreground mb-6">
          Get started by exploring your projects and managing your business relationships.
        </p>
        <div className="flex gap-4">
          <Button variant="default">Get Started</Button>
          <Button variant="outline">Learn More</Button>
        </div>
      </Card>
    </div>
  );
};

export default Index;