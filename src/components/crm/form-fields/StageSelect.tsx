import { DealStage } from "@/integrations/supabase/types/deals";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const stages = [
  { id: 'lead', label: 'Lead' },
  { id: 'meeting', label: 'Meeting' },
  { id: 'negotiation', label: 'Negotiation' },
  { id: 'project_preparation', label: 'Project Preparation' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'to_invoice', label: 'To Invoice' },
  { id: 'invoiced', label: 'Invoiced' },
  { id: 'paid', label: 'Paid' }
] as const;

interface StageSelectProps {
  value: DealStage;
  onValueChange: (value: DealStage) => void;
}

export const StageSelect = ({ value, onValueChange }: StageSelectProps) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select stage" />
      </SelectTrigger>
      <SelectContent>
        {stages.map((stage) => (
          <SelectItem key={stage.id} value={stage.id}>
            {stage.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};