import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreateInvoiceForm } from "./CreateInvoiceForm";
import { useState } from "react";
import { InvoicePreview } from "./InvoicePreview";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

interface CreateInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateInvoiceDialog = ({ open, onOpenChange }: CreateInvoiceDialogProps) => {
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row justify-between items-center">
          <DialogTitle>Create New Invoice</DialogTitle>
          {previewData && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? (
                <>
                  <EyeOff className="h-4 w-4 mr-2" />
                  Hide Preview
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Show Preview
                </>
              )}
            </Button>
          )}
        </DialogHeader>
        
        <div className="grid grid-cols-1 gap-4">
          {showPreview && previewData && (
            <div className="border rounded-lg">
              <InvoicePreview invoice={previewData} />
            </div>
          )}
          <CreateInvoiceForm 
            onSuccess={() => onOpenChange(false)}
            onDataChange={setPreviewData}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};