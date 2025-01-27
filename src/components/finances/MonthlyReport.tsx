import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { MonthYearSelector } from "./MonthYearSelector";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export const MonthlyReport = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FileText className="h-4 w-4 mr-2" />
          Monthly Report
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Monthly Report</DialogTitle>
        </DialogHeader>
        <MonthYearSelector />
      </DialogContent>
    </Dialog>
  );
};