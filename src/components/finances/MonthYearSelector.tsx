import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface MonthYearSelectorProps {
  selectedDate: Date;
  onMonthSelect: (month: number) => void;
  onYearSelect: (year: number) => void;
}

export const MonthYearSelector = ({
  selectedDate,
  onMonthSelect,
  onYearSelect,
}: MonthYearSelectorProps) => {
  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(i);
    return {
      value: i,
      label: format(date, 'MMMM'),
    };
  });

  const years = Array.from({ length: 5 }, (_, i) => {
    const year = new Date().getFullYear() - 2 + i;
    return {
      value: year,
      label: year.toString(),
    };
  });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Calendar className="h-4 w-4" />
          {format(selectedDate, 'MMMM yyyy')}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="start">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Month</h4>
            <div className="grid grid-cols-3 gap-2">
              {months.map((month) => (
                <Button
                  key={month.value}
                  variant={selectedDate.getMonth() === month.value ? "default" : "outline"}
                  className="text-xs"
                  onClick={() => onMonthSelect(month.value)}
                >
                  {month.label}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Year</h4>
            <div className="flex gap-2">
              {years.map((year) => (
                <Button
                  key={year.value}
                  variant={selectedDate.getFullYear() === year.value ? "default" : "outline"}
                  className="text-xs"
                  onClick={() => onYearSelect(year.value)}
                >
                  {year.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};