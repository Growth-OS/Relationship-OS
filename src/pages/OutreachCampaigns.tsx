import { useState } from "react";
import { CreateCampaignDialog } from "@/components/prospects/components/sequence-form/CreateCampaignDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function OutreachCampaigns() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Outreach Campaigns</h1>
        <CreateCampaignDialog>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Campaign
          </Button>
        </CreateCampaignDialog>
      </div>
      <div className="grid gap-4">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <p className="text-sm text-muted-foreground">
              No campaigns found. Create a new campaign to get started.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}