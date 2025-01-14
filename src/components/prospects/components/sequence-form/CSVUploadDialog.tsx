import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import Papa from "papaparse";
import { supabase } from "@/integrations/supabase/client";

interface CSVCampaignRow {
  name: string;
  description?: string;
  [key: `step_${number}_type`]: string;
  [key: `step_${number}_delay`]: string;
  [key: `step_${number}_message`]: string;
}

export const CSVUploadDialog = () => {
  const [open, setOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setIsUploading(true);

    try {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          const { data, errors } = results;
          
          if (errors.length > 0) {
            toast.error("Error parsing CSV file");
            return;
          }

          const { data: { user } } = await supabase.auth.getUser();
          
          if (!user) {
            toast.error("You must be logged in to upload campaigns");
            return;
          }

          // Process each row with proper typing
          for (const row of data as CSVCampaignRow[]) {
            try {
              // Create campaign
              const { data: campaign, error: campaignError } = await supabase
                .from("outreach_campaigns")
                .insert({
                  name: row.name || "Imported Campaign",
                  description: row.description || "",
                  user_id: user.id,
                })
                .select()
                .single();

              if (campaignError) throw campaignError;

              if (campaign) {
                // Create steps
                const steps = [];
                let stepCount = 1;

                while (row[`step_${stepCount}_type`]) {
                  steps.push({
                    campaign_id: campaign.id,
                    step_type: row[`step_${stepCount}_type`] || "email",
                    delay_days: parseInt(row[`step_${stepCount}_delay`] || "0"),
                    message_template: row[`step_${stepCount}_message`] || "",
                    sequence_order: stepCount - 1,
                  });
                  stepCount++;
                }

                if (steps.length > 0) {
                  const { error: stepsError } = await supabase
                    .from("campaign_steps")
                    .insert(steps);

                  if (stepsError) throw stepsError;
                }
              }
            } catch (error) {
              console.error("Error processing row:", error);
              toast.error(`Error processing row: ${error.message}`);
            }
          }

          toast.success("Campaigns imported successfully");
          setOpen(false);
        },
        error: (error) => {
          console.error("Error parsing CSV:", error);
          toast.error("Error parsing CSV file");
        },
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Error uploading file");
    } finally {
      setIsUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
    },
    maxFiles: 1,
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="h-4 w-4 mr-2" />
          Import Campaigns
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import Campaigns from CSV</DialogTitle>
        </DialogHeader>
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            ${isDragActive ? "border-primary bg-primary/10" : "border-gray-300"}
          `}
        >
          <input {...getInputProps()} />
          {isUploading ? (
            <div className="text-sm text-muted-foreground">Uploading...</div>
          ) : isDragActive ? (
            <div className="text-sm text-muted-foreground">Drop the file here</div>
          ) : (
            <div className="text-sm text-muted-foreground">
              Drag and drop a CSV file here, or click to select a file
              <p className="mt-2 text-xs">
                Required columns: name, description (optional), step_1_type, step_1_delay, step_1_message, etc.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};