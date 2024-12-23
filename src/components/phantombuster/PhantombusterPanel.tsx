import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Play, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface PhantombusterScript {
  id: string;
  name: string;
  description: string;
  lastEndTime?: string;
}

export const PhantombusterPanel = () => {
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const { data: response, isLoading, refetch } = useQuery({
    queryKey: ['phantombuster-scripts'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('phantombuster', {
        body: { action: 'listScripts' },
      });
      
      if (error) throw error;
      return data;
    },
  });

  const scripts = Array.isArray(response?.data) ? response.data : [];

  const runPostLikers = async (scriptId: string) => {
    if (!linkedinUrl) {
      toast.error('Please enter a LinkedIn post URL');
      return;
    }

    try {
      setIsRunning(true);
      const { error } = await supabase.functions.invoke('phantombuster', {
        body: { 
          action: 'runPostLikers',
          scriptId,
          linkedinUrl,
        },
      });
      
      if (error) throw error;
      
      toast.success('Post likers have been added to prospects');
      setLinkedinUrl('');
    } catch (error) {
      console.error('Error running script:', error);
      toast.error('Failed to run script');
    } finally {
      setIsRunning(false);
    }
  };

  if (isLoading) {
    return <div>Loading scripts...</div>;
  }

  if (scripts.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Phantombuster Scripts</h2>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
        <Card className="p-6">
          <p className="text-gray-500">No LinkedIn scripts available. Make sure your Phantombuster API key is configured correctly.</p>
        </Card>
      </div>
    );
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
        {scripts.map((script: PhantombusterScript) => (
          <Card key={script.id} className="p-4 space-y-4">
            <div>
              <h3 className="font-medium">{script.name}</h3>
              <p className="text-sm text-gray-500">{script.description}</p>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                Last run: {script.lastEndTime ? new Date(script.lastEndTime).toLocaleDateString() : 'Never'}
              </span>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Play className="w-4 h-4 mr-2" />
                    Run
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Run {script.name}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">LinkedIn Post URL</label>
                      <Input
                        value={linkedinUrl}
                        onChange={(e) => setLinkedinUrl(e.target.value)}
                        placeholder="https://www.linkedin.com/posts/..."
                        className="mt-1"
                      />
                    </div>
                    <Button 
                      onClick={() => runPostLikers(script.id)}
                      disabled={isRunning}
                      className="w-full"
                    >
                      {isRunning ? 'Running...' : 'Start Script'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};