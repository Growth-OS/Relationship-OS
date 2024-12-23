import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import { DealFormData } from "../types";

interface StageSelectProps {
  register: UseFormRegister<DealFormData>;
  setValue: UseFormSetValue<DealFormData>;
}

export const stages = [
  { id: 'lead', label: 'Lead' },
  { id: 'meeting', label: 'Meeting' },
  { id: 'negotiation', label: 'Negotiation' },
  { id: 'project_preparation', label: 'Project Preparation' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'to_invoice', label: 'To Invoice' },
  { id: 'invoiced', label: 'Invoiced' },
  { id: 'paid', label: 'Paid' },
];

export const StageSelect = ({ register, setValue }: StageSelectProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="stage">Stage</Label>
      <Select defaultValue="lead" onValueChange={(value) => setValue('stage', value as DealFormData['stage'])}>
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
      <input type="hidden" {...register('stage')} />
    </div>
  );
};