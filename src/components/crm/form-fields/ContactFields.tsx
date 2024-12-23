import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { UseFormRegister } from "react-hook-form";
import { DealFormData } from "../types";

interface ContactFieldsProps {
  register: UseFormRegister<DealFormData>;
}

export const ContactFields = ({ register }: ContactFieldsProps) => {
  return (
    <>
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