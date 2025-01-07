import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import { DealFormData } from "../types";
import { CountrySelect } from "./CountrySelect";
import { StageSelect } from "./StageSelect";
import { ContactFields } from "./ContactFields";
import { DeliveryDates } from "./DeliveryDates";
import { NotesInput } from "./NotesInput";
import { UseFormReturn } from "react-hook-form";

interface DealFormFieldsProps {
  register: UseFormRegister<DealFormData>;
  setValue: UseFormSetValue<DealFormData>;
  form: UseFormReturn<DealFormData>;
}

export const DealFormFields = ({ register, setValue, form }: DealFormFieldsProps) => {
  const { watch } = form;
  const currentStage = watch('stage');

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="col-span-2">
        <CountrySelect register={register} setValue={setValue} />
      </div>

      <div className="col-span-2">
        <Label htmlFor="company_name">Company Name</Label>
        <Input id="company_name" {...register('company_name', { required: true })} />
      </div>

      <div className="col-span-2">
        <Label htmlFor="company_website">Company Website</Label>
        <Input 
          id="company_website" 
          type="url" 
          placeholder="https://example.com"
          {...register('company_website')} 
        />
      </div>

      <div className="col-span-1 space-y-2">
        <Label htmlFor="stage">Stage</Label>
        <StageSelect 
          value={currentStage} 
          onValueChange={(value) => setValue('stage', value)} 
        />
      </div>

      <div className="col-span-1 space-y-2">
        <Label htmlFor="deal_value">Deal Value</Label>
        <Input
          id="deal_value"
          type="number"
          {...register('deal_value', { required: true, min: 0 })}
        />
      </div>

      <div className="col-span-2">
        <DeliveryDates register={register} />
      </div>
      
      <div className="col-span-2">
        <ContactFields register={register} />
      </div>

      <div className="col-span-2">
        <NotesInput form={form} />
      </div>
    </div>
  );
};