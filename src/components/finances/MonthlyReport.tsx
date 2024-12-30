import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { generatePDFReport } from "./exports/PDFExporter";
import { exportToCSV } from "./exports/CSVExporter";

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
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate monthly report');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = async () => {
    try {
      setIsGenerating(true);
      const transactions = await fetchTransactions();
      await exportToCSV(transactions, selectedDate);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export transactions');
    } finally {
      setIsGenerating(false);
    }
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
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarComponent
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            initialFocus
          />
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
          <DropdownMenuItem onClick={handleExport} className="cursor-pointer">
            <Download className="h-4 w-4 mr-2" />
            Export as CSV
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};