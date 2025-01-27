import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { CSVExporter } from "./exports/CSVExporter";
import { PDFExporter } from "./exports/PDFExporter";
import { ZIPExporter } from "./exports/ZIPExporter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const ExportTransactions = () => {
  const handleExport = async (format: 'csv' | 'pdf' | 'zip') => {
    try {
      switch (format) {
        case 'csv':
          await CSVExporter.export();
          break;
        case 'pdf':
          await PDFExporter.export();
          break;
        case 'zip':
          await ZIPExporter.export();
          break;
      }
      toast.success(`Transactions exported as ${format.toUpperCase()} successfully`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Error exporting transactions');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
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