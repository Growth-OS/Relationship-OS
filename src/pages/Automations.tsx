import { PhantombusterPanel } from "@/components/phantombuster/PhantombusterPanel";
import { Card } from "@/components/ui/card";

const Automations = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">Automations</h1>
        <p className="text-gray-600">Manage your automated workflows</p>
      </div>

      <Card className="p-6">
        <PhantombusterPanel />
      </Card>
    </div>
  );
};

export default Automations;