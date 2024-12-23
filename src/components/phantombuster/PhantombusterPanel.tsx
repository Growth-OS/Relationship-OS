import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export const PhantombusterPanel = () => {
  const { data: scripts, isLoading, refetch } = useQuery({
    queryKey: ['phantombuster-scripts'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('phantombuster', {
        body: { action: 'listScripts' },
      });
      
      if (error) throw error;
      return data;
    },
  });

  const runScript = async (scriptId: string) => {
    try {
      const { error } = await supabase.functions.invoke('phantombuster', {
        body: { 
          action: 'runScript',
          scriptId,
        },
      });
      
      if (error) throw error;
      toast.success('Script launched successfully');
    } catch (error) {
      console.error('Error running script:', error);
      toast.error('Failed to run script');
    }
  };

  if (isLoading) {
    return <div>Loading scripts...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Phantombuster Scripts</h2>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scripts?.map((script: any) => (
          <Card key={script.id} className="p-4 space-y-4">
            <div>
              <h3 className="font-medium">{script.name}</h3>
              <p className="text-sm text-gray-500">{script.description}</p>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                Last run: {script.lastEndTime ? new Date(script.lastEndTime).toLocaleDateString() : 'Never'}
              </span>
              <Button size="sm" onClick={() => runScript(script.id)}>
                <Play className="w-4 h-4 mr-2" />
                Run
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};