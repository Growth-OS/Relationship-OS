import { LostReason } from "@/integrations/supabase/types/deals";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const lostReasons = [
  { id: 'price_too_high', label: 'Price too high' },
  { id: 'chose_competitor', label: 'Chose competitor' },
  { id: 'no_budget', label: 'No budget' },
  { id: 'timing_not_right', label: 'Timing not right' },
  { id: 'no_decision_made', label: 'No decision made' },
  { id: 'requirements_changed', label: 'Requirements changed' },
  { id: 'lost_contact', label: 'Lost contact' }
] as const;

interface LostReasonSelectProps {
  value: LostReason | null;
  onValueChange: (value: LostReason) => void;
}

export const LostReasonSelect = ({ value, onValueChange }: LostReasonSelectProps) => {
  return (
    <Select value={value || undefined} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select reason" />
      </SelectTrigger>
      <SelectContent>
        {lostReasons.map((reason) => (
          <SelectItem key={reason.id} value={reason.id}>
            {reason.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};