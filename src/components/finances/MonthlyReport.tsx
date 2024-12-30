import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, Download, Archive } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { generatePDFReport } from "./exports/PDFExporter";
import { exportToCSV } from "./exports/CSVExporter";
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

  const handleGenerateReport = async () => {
    try {
      setIsGenerating(true);
      const transactions = await fetchTransactions();
      await generatePDFReport(transactions, selectedDate);
      toast.success('PDF report generated successfully');
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate monthly report');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateZIP = async () => {
    try {
      setIsGenerating(true);
      const transactions = await fetchTransactions();
      await generateZIPReport(transactions, selectedDate);
      toast.success('ZIP report with images generated successfully');
    } catch (error) {
      console.error('Error generating ZIP report:', error);
      toast.error('Failed to generate ZIP report');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = async () => {
    try {
      setIsGenerating(true);
      const transactions = await fetchTransactions();
      await exportToCSV(transactions, selectedDate);
      toast.success('CSV exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export transactions');
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

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" disabled={isGenerating} className="gap-2">
            <FileText className="h-4 w-4" />
            {isGenerating ? 'Processing...' : 'Export'}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-background">
          <DropdownMenuItem onClick={handleGenerateReport} className="cursor-pointer">
            <FileText className="h-4 w-4 mr-2" />
            Generate PDF Report
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleGenerateZIP} className="cursor-pointer">
            <Archive className="h-4 w-4 mr-2" />
            Export PDF + Images (ZIP)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleExport} className="cursor-pointer">
            <Download className="h-4 w-4 mr-2" />
            Export as CSV
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};