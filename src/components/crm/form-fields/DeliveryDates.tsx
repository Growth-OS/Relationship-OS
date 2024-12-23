import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { UseFormRegister } from "react-hook-form";
import { DealFormData } from "../types";

interface DeliveryDatesProps {
  register: UseFormRegister<DealFormData>;
}

export const DeliveryDates = ({ register }: DeliveryDatesProps) => {
  return (
    <>
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
    </>
  );
};