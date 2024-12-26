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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPDFPreview();
    return () => {
      // Cleanup preview URL when component unmounts
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [filePath]);

  const loadPDFPreview = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.storage
        .from('financial_docs')
        .download(filePath);

      if (error) {
        console.error('Preview error:', error);
        toast.error('Failed to load PDF preview');
        return;
      }

      if (data) {
        // Create a blob URL with explicit PDF type
        const blob = new Blob([data], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
      }
    } catch (error) {
      console.error('Error loading PDF preview:', error);
      toast.error('Failed to load PDF preview');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        {isLoading ? (
          <div className="w-full h-[400px] rounded-lg border border-gray-200 flex items-center justify-center bg-gray-50">
            Loading PDF preview...
          </div>
        ) : previewUrl ? (
          <object
            data={previewUrl}
            type="application/pdf"
            className="w-full h-[400px] rounded-lg border border-gray-200"
          >
            <div className="w-full h-[400px] rounded-lg border border-gray-200 flex items-center justify-center bg-gray-50">
              Unable to display PDF. <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-500 hover:underline">Download instead</a>
            </div>
          </object>
        ) : (
          <div className="w-full h-[400px] rounded-lg border border-gray-200 flex items-center justify-center bg-gray-50">
            Failed to load PDF preview
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