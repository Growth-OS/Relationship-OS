import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { DealFormData } from "../types";

type NotesInputProps = {
  register: UseFormReturn<DealFormData>['register'];
};

export const NotesInput = ({ register }: NotesInputProps) => {
  return (
    <div className="space-y-2">
      <FormLabel>Notes (Optional)</FormLabel>
      <FormControl>
        <Textarea 
          placeholder="Add any relevant notes" 
          className="min-h-[100px] resize-none" 
          {...register('notes')}
        />
      </FormControl>
    </div>
  );
};