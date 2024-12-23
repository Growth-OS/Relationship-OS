import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UseFormRegister } from "react-hook-form";
import { DealFormData } from "../types";

type NotesInputProps = {
  register: UseFormRegister<DealFormData>;
};

export const NotesInput = ({ register }: NotesInputProps) => {
  return (
    <div className="space-y-2">
      <Label>Notes (Optional)</Label>
      <Textarea 
        placeholder="Add any relevant notes" 
        className="min-h-[100px] resize-none" 
        {...register('notes')}
      />
    </div>
  );
};