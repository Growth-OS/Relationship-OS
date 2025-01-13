import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { Search } from "lucide-react";

interface ExistingSequencesListProps {
  selectedProspects: string[];
  onSuccess: () => void;
}

export const ExistingSequencesList = ({
  selectedProspects,
  onSuccess,
}: ExistingSequencesListProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: sequences, isLoading } = useQuery({
    queryKey: ["sequences"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sequences")
        .select("*")
        .eq("status", "active")
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
      const assignmentsToInsert = selectedProspects.map(prospectId => ({
        sequence_id: sequenceId,
        prospect_id: prospectId,
        status: "active",
        current_step: 1,
      }));

      const { error } = await supabase
        .from("sequence_assignments")
        .insert(assignmentsToInsert);

      if (error) throw error;

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
              </div>
              <Button
                onClick={() => assignProspectsToSequence(sequence.id)}
                size="sm"
              >
                Assign
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};