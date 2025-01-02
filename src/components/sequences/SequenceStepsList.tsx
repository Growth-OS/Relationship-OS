interface SequenceStep {
  id: string;
  step_number: number;
  step_type: "email" | "linkedin";
  message_template: string;
  delay_days: number;
  preferred_time?: string;
}

interface SequenceStepsListProps {
  steps: SequenceStep[];
}

export const SequenceStepsList = ({ steps }: SequenceStepsListProps) => {
  return (
    <div className="space-y-4">
      {steps?.length === 0 ? (
        <p className="text-muted-foreground">No steps added yet. Start building your sequence by adding steps.</p>
      ) : (
        <div className="space-y-4">
          {steps?.map((step) => (
            <div key={step.id} className="border p-4 rounded-md">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">Step {step.step_number}</h3>
                  <p className="text-sm text-muted-foreground capitalize">{step.step_type}</p>
                </div>
                <div className="text-sm text-muted-foreground">
                  {step.delay_days} day{step.delay_days !== 1 ? 's' : ''} delay
                  {step.preferred_time && ` at ${step.preferred_time}`}
                </div>
              </div>
              <div className="mt-2 text-sm whitespace-pre-wrap">{step.message_template}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};