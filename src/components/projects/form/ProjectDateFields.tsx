import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ProjectFormData } from "./types";

interface ProjectDateFieldsProps {
  form: UseFormReturn<ProjectFormData>;
}

export const ProjectDateFields = ({ form }: ProjectDateFieldsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="start_date"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Start Date</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    className={cn(
                      "pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(field.value, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  initialFocus
                  disabled={(date) =>
                    date < new Date("1900-01-01") ||
                    date > new Date("2100-01-01")
                  }
                />
              </PopoverContent>
            </Popover>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="end_date"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>End Date</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    className={cn(
                      "pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(field.value, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  initialFocus
                  disabled={(date) =>
                    date < new Date("1900-01-01") ||
                    date > new Date("2100-01-01")
                  }
                />
              </PopoverContent>
            </Popover>
          </FormItem>
        )}
      />
    </div>
  );
};