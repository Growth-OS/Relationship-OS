import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import { DealFormData } from "../types";
import { Flag } from "lucide-react";

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

const countries = [
  { id: 'us', name: 'United States', flag: '🇺🇸' },
  { id: 'gb', name: 'United Kingdom', flag: '🇬🇧' },
  { id: 'fr', name: 'France', flag: '🇫🇷' },
  { id: 'de', name: 'Germany', flag: '🇩🇪' },
  { id: 'es', name: 'Spain', flag: '🇪🇸' },
  { id: 'it', name: 'Italy', flag: '🇮🇹' },
  { id: 'nl', name: 'Netherlands', flag: '🇳🇱' },
  { id: 'be', name: 'Belgium', flag: '🇧🇪' },
  { id: 'ch', name: 'Switzerland', flag: '🇨🇭' },
  { id: 'se', name: 'Sweden', flag: '🇸🇪' },
  { id: 'no', name: 'Norway', flag: '🇳🇴' },
  { id: 'dk', name: 'Denmark', flag: '🇩🇰' },
  { id: 'fi', name: 'Finland', flag: '🇫🇮' },
  { id: 'pt', name: 'Portugal', flag: '🇵🇹' },
  { id: 'ie', name: 'Ireland', flag: '🇮🇪' },
  { id: 'at', name: 'Austria', flag: '🇦🇹' },
];

export const DealFormFields = ({ register, setValue }: DealFormFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="country">Country</Label>
        <Select onValueChange={(value) => {
          const country = countries.find(c => c.id === value);
          setValue('country', country?.name || '');
          setValue('country_flag', country?.flag || '');
        }}>
          <SelectTrigger>
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent>
            {countries.map((country) => (
              <SelectItem key={country.id} value={country.id}>
                <div className="flex items-center gap-2">
                  <span>{country.flag}</span>
                  <span>{country.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <input type="hidden" {...register('country')} />
        <input type="hidden" {...register('country_flag')} />
      </div>

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