import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Wand2 } from "lucide-react";

interface CampaignStep {
  id: string;
  step_type: string;
  delay_days: number;
  message_template_or_prompt: string | null;
  sequence_order: number;
  is_ai_enabled?: boolean;
  message_prompt?: string;
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
                  <div className="flex items-center gap-2">
                    <span>Step {index + 1} - {getStepTypeDisplay(step.step_type)} ({step.delay_days} days)</span>
                    {step.is_ai_enabled && (
                      <Badge variant="secondary" className="ml-2">
                        <Wand2 className="h-3 w-3 mr-1" />
                        AI Enabled
                      </Badge>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    {step.is_ai_enabled && step.message_prompt && (
                      <div>
                        <p className="text-sm font-medium mb-1">AI Prompt:</p>
                        <p className="text-sm text-muted-foreground bg-secondary/50 p-2 rounded-md">
                          {step.message_prompt}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium mb-1">Message Template:</p>
                      <div className="text-sm text-muted-foreground bg-secondary/50 p-2 rounded-md whitespace-pre-wrap">
                        {step.message_template_or_prompt || "No message template"}
                      </div>
                    </div>
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