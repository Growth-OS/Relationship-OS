import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";
import CSVExporter from "./exports/CSVExporter";
import PDFExporter from "./exports/PDFExporter";
import ZIPExporter from "./exports/ZIPExporter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { useTransactionsFetch } from "./hooks/useTransactionsFetch";

export const ExportTransactions = () => {
  const [selectedDate] = useState(new Date());
  const { fetchTransactions, isGenerating, setIsGenerating } = useTransactionsFetch();

  const handleExport = async (format: 'csv' | 'pdf' | 'zip') => {
    try {
      setIsGenerating(true);
      const transactions = await fetchTransactions(selectedDate);

      switch (format) {
        case 'csv':
          await CSVExporter.export(transactions, selectedDate);
          break;
        case 'pdf':
          await PDFExporter.export(transactions, selectedDate);
          break;
        case 'zip':
          await ZIPExporter.export(transactions, selectedDate);
          break;
      }
      toast.success(`Transactions exported as ${format.toUpperCase()} successfully`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Error exporting transactions');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={isGenerating}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleExport('csv')}>
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('pdf')}>
          Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('zip')}>
          Export as ZIP
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};