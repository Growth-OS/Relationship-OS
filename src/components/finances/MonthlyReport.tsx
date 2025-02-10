import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Archive } from "lucide-react";
import { toast } from "sonner";
import { generateZIPReport } from "./exports/ZIPExporter";
import { MonthYearSelector } from "./MonthYearSelector";
import { useTransactionsFetch } from "./hooks/useTransactionsFetch";

export const MonthlyReport = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { isGenerating, setIsGenerating, fetchTransactions } = useTransactionsFetch();

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

  const handleExport = async () => {
    try {
      setIsGenerating(true);
      const transactions = await fetchTransactions(selectedDate);
      await generateZIPReport(transactions, selectedDate);
      toast.success('Report generated successfully');
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <MonthYearSelector
        selectedDate={selectedDate}
        onMonthSelect={handleMonthSelect}
        onYearSelect={handleYearSelect}
      />

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