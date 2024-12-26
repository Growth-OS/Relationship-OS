import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Maximize2, Minimize2 } from "lucide-react";
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
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    loadPDFPreview();
    return () => {
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

  const toggleSize = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        {isLoading ? (
          <div className={`w-full rounded-lg border border-gray-200 flex items-center justify-center bg-gray-50 ${isExpanded ? 'h-[800px]' : 'h-[400px]'}`}>
            Loading PDF preview...
          </div>
        ) : previewUrl ? (
          <object
            data={previewUrl}
            type="application/pdf"
            className={`w-full rounded-lg border border-gray-200 ${isExpanded ? 'h-[800px]' : 'h-[400px]'}`}
          >
            <div className={`w-full rounded-lg border border-gray-200 flex items-center justify-center bg-gray-50 ${isExpanded ? 'h-[800px]' : 'h-[400px]'}`}>
              Unable to display PDF. <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-500 hover:underline">Download instead</a>
            </div>
          </object>
        ) : (
          <div className={`w-full rounded-lg border border-gray-200 flex items-center justify-center bg-gray-50 ${isExpanded ? 'h-[800px]' : 'h-[400px]'}`}>
            Failed to load PDF preview
          </div>
        )}
        <div className="absolute top-2 right-2 flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={toggleSize}
          >
            {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <p className="text-sm text-gray-500 text-center">{fileName}</p>
    </div>
  );
};