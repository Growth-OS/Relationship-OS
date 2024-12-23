import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import { DealFormData } from "../types";
import { CountrySelect } from "./CountrySelect";
import { StageSelect } from "./StageSelect";
import { ContactFields } from "./ContactFields";
import { DeliveryDates } from "./DeliveryDates";
import { NotesInput } from "./NotesInput";

interface DealFormFieldsProps {
  register: UseFormRegister<DealFormData>;
  setValue: UseFormSetValue<DealFormData>;
}

export const DealFormFields = ({ register, setValue }: DealFormFieldsProps) => {
  return (
    <>
      <CountrySelect register={register} setValue={setValue} />

      <div className="space-y-2">
        <Label htmlFor="company_name">Company Name</Label>
        <Input id="company_name" {...register('company_name', { required: true })} />
      </div>

      <StageSelect register={register} setValue={setValue} />

      <div className="space-y-2">
        <Label htmlFor="deal_value">Deal Value</Label>
        <Input
          id="deal_value"
          type="number"
          {...register('deal_value', { required: true, min: 0 })}
        />
      </div>

      <DeliveryDates register={register} />
      
      <ContactFields register={register} />

      <NotesInput form={{ control: register, register }} />
    </>
  );
};