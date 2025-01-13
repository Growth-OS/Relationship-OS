import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SequencesList } from "@/components/sequences/SequencesList";
import { TableEmptyState } from "@/components/prospects/components/TableEmptyState";
import { TableLoadingState } from "@/components/prospects/components/TableLoadingState";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { CreateSequenceDialog } from "@/components/sequences/CreateSequenceDialog";

const Sequences = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const { data: sequences, isLoading } = useQuery({
    queryKey: ["sequences"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sequences")
        .select(`
          *,
          sequence_steps(*),
          sequence_assignments(*)
        `)
        .eq("is_deleted", false)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <TableLoadingState />;
  if (!sequences?.length) return <TableEmptyState />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Sequences</h1>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Sequence
        </Button>
      </div>

      <SequencesList sequences={sequences} />

      <CreateSequenceDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </div>
  );
};

export default Sequences;