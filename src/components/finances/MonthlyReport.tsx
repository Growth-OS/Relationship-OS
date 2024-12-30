import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Archive } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { generateZIPReport } from "./exports/ZIPExporter";

export const MonthlyReport = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const fetchTransactions = async () => {
    const startDate = startOfMonth(selectedDate);
    const endDate = endOfMonth(selectedDate);

    const { data: transactions, error } = await supabase
      .from('financial_transactions')
      .select(`
        *,
        transaction_attachments (
          id,
          file_name,
          file_path
        )
      `)
      .gte('date', startDate.toISOString())
      .lte('date', endDate.toISOString())
      .order('date', { ascending: true });

    if (error) throw error;
    return transactions;
  };

  const handleExport = async () => {
    try {
      setIsGenerating(true);
      const transactions = await fetchTransactions();
      await generateZIPReport(transactions, selectedDate);
      toast.success('Report generated successfully');
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    } finally {
      setIsGenerating(false);
    }
  };

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

  const handleMonthSelect = (month: number) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(month);
    setSelectedDate(newDate);
  };

  const handleYearSelect = (year: number) => {
    const newDate = new Date(selectedDate);
    newDate.setFullYear(year);
    setSelectedDate(newDate);
  };

  return (
    <div className="flex items-center gap-2">
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
                    onClick={() => handleMonthSelect(month.value)}
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
                    onClick={() => handleYearSelect(year.value)}
                  >
                    {year.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Button 
        variant="outline" 
        disabled={isGenerating} 
        onClick={handleExport}
        className="gap-2"
      >
        <Archive className="h-4 w-4" />
        {isGenerating ? 'Processing...' : 'Export'}
      </Button>
    </div>
  );
};