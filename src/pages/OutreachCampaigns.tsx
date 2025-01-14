import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, List, Target } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Campaign {
  id: string;
  name: string;
  description: string | null;
  status: string;
  created_at: string;
}

const OutreachCampaigns = () => {
  const { toast } = useToast();
  
  const { data: campaigns, isLoading } = useQuery({
    queryKey: ['campaigns'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('outreach_campaigns')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching campaigns",
          description: error.message,
        });
        throw error;
      }
      
      return data as Campaign[];
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Outreach Campaigns</h1>
          <p className="text-muted-foreground mt-1">
            Manage your outreach campaigns and sequences
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Campaign
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {campaigns?.map((campaign) => (
          <Card key={campaign.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                {campaign.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {campaign.description || "No description provided"}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm">
                  {new Date(campaign.created_at).toLocaleDateString()}
                </span>
                <Button variant="outline" size="sm">
                  <List className="h-4 w-4 mr-2" />
                  View Steps
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {campaigns?.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Target className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-xl font-semibold mb-2">No campaigns yet</p>
            <p className="text-muted-foreground mb-4">
              Create your first outreach campaign to get started
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Campaign
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OutreachCampaigns;