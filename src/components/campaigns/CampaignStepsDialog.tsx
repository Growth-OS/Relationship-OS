import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface CampaignStep {
  id: string;
  step_type: string;
  delay_days: number;
  message_template: string | null;
  sequence_order: number;
}

interface CampaignStepsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  steps: CampaignStep[] | undefined;
  isLoading: boolean;
}

export const CampaignStepsDialog = ({ 
  open, 
  onOpenChange, 
  steps, 
  isLoading 
}: CampaignStepsDialogProps) => {
  const getStepTypeDisplay = (type: string) => {
    switch (type) {
      case 'email':
        return 'Email 1';
      case 'email_2':
        return 'Email 2';
      case 'linkedin_connection':
        return 'LinkedIn Connection';
      case 'linkedin_message':
        return 'LinkedIn Message';
      default:
        return type;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Campaign Steps</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {steps?.map((step, index) => (
              <AccordionItem key={step.id} value={step.id}>
                <AccordionTrigger>
                  Step {index + 1} - {getStepTypeDisplay(step.step_type)} ({step.delay_days} days)
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Message Template:</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {step.message_template || "No message template"}
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </DialogContent>
    </Dialog>
  );
};