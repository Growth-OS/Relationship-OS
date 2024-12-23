import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import { DealFormData } from "../types";

interface DealFormFieldsProps {
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

export const DealFormFields = ({ register, setValue }: DealFormFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="company_name">Company Name</Label>
        <Input id="company_name" {...register('company_name', { required: true })} />
      </div>

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

      <div className="space-y-2">
        <Label htmlFor="deal_value">Deal Value</Label>
        <Input
          id="deal_value"
          type="number"
          {...register('deal_value', { required: true, min: 0 })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="delivery_start_date">Delivery Start Date</Label>
        <Input
          id="delivery_start_date"
          type="date"
          {...register('delivery_start_date')}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="delivery_end_date">Delivery End Date</Label>
        <Input
          id="delivery_end_date"
          type="date"
          {...register('delivery_end_date')}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact_email">Contact Email</Label>
        <Input
          id="contact_email"
          type="email"
          {...register('contact_email')}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact_linkedin">Contact LinkedIn</Label>
        <Input
          id="contact_linkedin"
          {...register('contact_linkedin')}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact_job_title">Contact Job Title</Label>
        <Input
          id="contact_job_title"
          {...register('contact_job_title')}
        />
      </div>
    </>
  );
};