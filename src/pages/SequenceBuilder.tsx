import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle, ArrowLeft, Loader2 } from "lucide-react";
import { AddStepDialog } from "@/components/sequences/AddStepDialog";
import { SequenceStepsList } from "@/components/sequences/SequenceStepsList";
import { useState } from "react";
import { useSequenceSteps } from "@/components/sequences/hooks/useSequenceSteps";
import { StepType } from "@/components/sequences/types";
import { toast } from "sonner";

const SequenceBuilder = () => {
  const { sequenceId } = useParams<{ sequenceId: string }>();
  const [isAddStepOpen, setIsAddStepOpen] = useState(false);
  
  // Add validation for sequenceId
  if (!sequenceId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-muted-foreground">Invalid sequence ID</p>
        <Link to="/dashboard/sequences">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Sequences
          </Button>
        </Link>
      </div>
    );
  }

  const { 
    sequence, 
    isLoading, 
    addStep, 
    isAddingStep,
    error 
  } = useSequenceSteps(sequenceId);

  if (error) {
    console.error('Error loading sequence:', error);
    toast.error("Failed to load sequence");
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-muted-foreground">Error loading sequence</p>
        <Link to="/dashboard/sequences">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Sequences
          </Button>
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading sequence...</span>
        </div>
      </div>
    );
  }

  if (!sequence) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-muted-foreground">Sequence not found</p>
        <Link to="/dashboard/sequences">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Sequences
          </Button>
        </Link>
      </div>
    );
  }

  const handleAddStep = (values: {
    step_type: StepType;
    message_template: string;
    delay_days: number;
  }) => {
    addStep(values);
    setIsAddStepOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-4">
            <Link to="/dashboard/sequences">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Sequences
              </Button>
            </Link>
          </div>
          <h1 className="text-2xl font-bold">{sequence.name}</h1>
          <p className="text-muted-foreground">{sequence.description}</p>
        </div>
      </div>
      
      <div className="border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Sequence Steps</h2>
          <Button 
            onClick={() => setIsAddStepOpen(true)}
            disabled={isAddingStep}
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Step
          </Button>
        </div>

        <SequenceStepsList steps={sequence.sequence_steps} />

        <AddStepDialog
          open={isAddStepOpen}
          onOpenChange={setIsAddStepOpen}
          onSubmit={handleAddStep}
        />
      </div>
    </div>
  );
};

export default SequenceBuilder;