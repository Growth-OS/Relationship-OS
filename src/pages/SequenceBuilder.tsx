import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const SequenceBuilder = () => {
  const { sequenceId } = useParams();

  const { data: sequence, isLoading } = useQuery({
    queryKey: ["sequence", sequenceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sequences")
        .select(`
          *,
          sequence_steps (
            *
          )
        `)
        .eq("id", sequenceId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!sequence) {
    return <div>Sequence not found</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{sequence.name}</h1>
        <p className="text-muted-foreground">{sequence.description}</p>
      </div>
      
      <div className="border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Sequence Steps</h2>
        {sequence.sequence_steps?.length === 0 ? (
          <p className="text-muted-foreground">No steps added yet. Start building your sequence by adding steps.</p>
        ) : (
          <div className="space-y-4">
            {sequence.sequence_steps?.map((step: any) => (
              <div key={step.id} className="border p-4 rounded-md">
                <p>Step {step.step_number}</p>
                <p>{step.step_type}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SequenceBuilder;