import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface PDFPreviewProps {
  filePath: string;
  fileName: string;
  onDelete: () => void;
}

export const PDFPreview = ({ filePath, fileName, onDelete }: PDFPreviewProps) => {
  const [previewUrl, setPreviewUrl] = useState<string>("");

  useEffect(() => {
    loadPDFPreview();
    return () => {
      // Cleanup preview URL when component unmounts
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [filePath]);

  const loadPDFPreview = async () => {
    try {
      const { data, error } = await supabase.storage
        .from('financial_docs')
        .download(filePath);

      if (error) {
        console.error('Preview error:', error);
        toast.error('Failed to load PDF preview');
        return;
      }

      if (data) {
        const url = URL.createObjectURL(data);
        setPreviewUrl(url);
      }
    } catch (error) {
      console.error('Error loading PDF preview:', error);
      toast.error('Failed to load PDF preview');
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        {previewUrl ? (
          <iframe
            src={previewUrl}
            className="w-full h-[400px] rounded-lg border border-gray-200"
            title="PDF Preview"
          />
        ) : (
          <div className="w-full h-[400px] rounded-lg border border-gray-200 flex items-center justify-center bg-gray-50">
            Loading PDF preview...
          </div>
        )}
        <Button
          variant="destructive"
          size="sm"
          className="absolute top-2 right-2"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-sm text-gray-500 text-center">{fileName}</p>
    </div>
  );
};