import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { DealFormData } from "../types";

type NotesInputProps = {
  form: UseFormReturn<DealFormData>;
};

export const NotesInput = ({ form }: NotesInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="notes">Notes (Optional)</Label>
      <Input 
        id="notes"
        placeholder="Add any relevant notes" 
        {...form.register('notes')} 
      />
    </div>
  );
};