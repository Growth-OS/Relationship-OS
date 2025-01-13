import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { Search } from "lucide-react";
import { useMessageGeneration } from "../hooks/useMessageGeneration";

interface ExistingSequencesListProps {
  selectedProspects: string[];
  onAssign: (sequenceId: string) => Promise<void>;
  onSuccess: () => void;
}

export const ExistingSequencesList = ({
  selectedProspects,
  onAssign,
  onSuccess,
}: ExistingSequencesListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { generateMessage, isGenerating } = useMessageGeneration();

  const { data: sequences, isLoading } = useQuery({
    queryKey: ["sequences"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sequences")
        .select("*, sequence_steps(*)")
        .eq("status", "active")
        .eq("is_deleted", false) // Add this line to filter out deleted sequences
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const filteredSequences = sequences?.filter(sequence =>
    sequence.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const assignProspectsToSequence = async (sequenceId: string) => {
    try {
      // First, get prospect details for message generation
      const { data: prospects, error: prospectsError } = await supabase
        .from("prospects")
        .select("*")
        .in("id", selectedProspects);

      if (prospectsError) throw prospectsError;

      // Get sequence steps
      const { data: steps, error: stepsError } = await supabase
        .from("sequence_steps")
        .select("*")
        .eq("sequence_id", sequenceId)
        .order("step_number", { ascending: true });

      if (stepsError) throw stepsError;

      // Generate messages for each step and prospect
      for (const prospect of prospects) {
        const prospectData = {
          "First Name": prospect.first_name || "",
          "Company Name": prospect.company_name || "",
          "Website": prospect.company_website || "",
          "Training Event": prospect.training_event || "",
        };

        for (const step of steps) {
          if (step.message_template) {
            const generatedMessage = await generateMessage({
              template: step.message_template,
              prospectData,
              stepType: step.step_type,
            });

            if (generatedMessage) {
              // Update the step with the generated message
              const { error: updateError } = await supabase
                .from("sequence_steps")
                .update({ message_template: generatedMessage })
                .eq("id", step.id);

              if (updateError) throw updateError;
            }
          }
        }
      }

      // Assign prospects to the sequence
      await onAssign(sequenceId);
      toast.success("Prospects assigned to sequence successfully");
      onSuccess();
    } catch (error) {
      console.error("Error assigning prospects to sequence:", error);
      toast.error("Failed to assign prospects to sequence");
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search sequences..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8"
        />
      </div>

      {isLoading ? (
        <div className="text-center py-4">Loading sequences...</div>
      ) : filteredSequences?.length === 0 ? (
        <div className="text-center py-4 text-muted-foreground">
          No sequences found
        </div>
      ) : (
        <div className="space-y-2">
          {filteredSequences?.map((sequence) => (
            <div
              key={sequence.id}
              className="p-4 border rounded-lg flex items-center justify-between"
            >
              <div>
                <h3 className="font-medium">{sequence.name}</h3>
                {sequence.description && (
                  <p className="text-sm text-muted-foreground">
                    {sequence.description}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  {sequence.sequence_steps?.length || 0} steps
                </p>
              </div>
              <Button
                onClick={() => assignProspectsToSequence(sequence.id)}
                size="sm"
                disabled={isGenerating}
              >
                {isGenerating ? "Generating..." : "Assign"}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};