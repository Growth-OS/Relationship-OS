import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SequenceStats } from "@/components/sequences/SequenceStats";
import { SequencesList } from "@/components/sequences/SequencesList";
import { CreateSequenceButton } from "@/components/sequences/CreateSequenceButton";
import type { Sequence } from "@/components/sequences/types";
import { toast } from "sonner";

const Sequences = () => {
  const { data: sequences, isLoading, error } = useQuery({
    queryKey: ["sequences"],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast.error("Authentication required");
          throw new Error("Not authenticated");
        }

        console.log('Fetching sequences...');
        const { data, error } = await supabase
          .from("sequences")
          .select(`
            *,
            sequence_steps (
              count
            ),
            sequence_assignments (
              id,
              status,
              current_step,
              prospect: prospects (
                company_name
              )
            )
          `)
          .eq("user_id", user.id)
          .eq("is_deleted", false)
          .order("created_at", { ascending: false });

        if (error) {
          console.error('Error fetching sequences:', error);
          toast.error("Failed to load sequences");
          throw error;
        }

        console.log('Sequences fetched:', data);
        return data as unknown as Sequence[];
      } catch (err) {
        console.error('Query error:', err);
        throw err;
      }
    },
  });

  if (error) {
    console.error('Query error:', error);
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-500">Error loading sequences. Please try again.</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div className="text-left">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sequences</h1>
            <p className="text-muted-foreground">
              Create and manage your outreach sequences
            </p>
          </div>
          <CreateSequenceButton />
        </div>
      </div>

      <SequenceStats sequences={sequences || []} />
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <SequencesList sequences={sequences} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default Sequences;