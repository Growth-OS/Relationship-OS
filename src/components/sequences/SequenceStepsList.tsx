interface SequenceStep {
  id: string;
  step_number: number;
  step_type: "email_1" | "email_2" | "linkedin_connection" | "linkedin_message_1" | "linkedin_message_2";
  message_template: string;
  delay_days: number;
}

interface SequenceStepsListProps {
  steps: SequenceStep[];
}

export const SequenceStepsList = ({ steps }: SequenceStepsListProps) => {
  const getStepTypeDisplay = (stepType: SequenceStep["step_type"]) => {
    const displayMap = {
      email_1: "Email 1",
      email_2: "Email 2",
      linkedin_connection: "LinkedIn Connection Request",
      linkedin_message_1: "LinkedIn Message 1",
      linkedin_message_2: "LinkedIn Message 2"
    };
    return displayMap[stepType];
  };

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
                  <p className="text-sm text-muted-foreground">{getStepTypeDisplay(step.step_type)}</p>
                </div>
                <div className="text-sm text-muted-foreground">
                  {step.delay_days} day{step.delay_days !== 1 ? 's' : ''} from sequence start
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