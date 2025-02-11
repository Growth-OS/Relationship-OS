import { Button } from "@/components/ui/button";
import { FileUp, Upload } from "lucide-react";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface FileUploadZoneProps {
  uploading: boolean;
  uploadProgress?: number;
  onFileSelect: (file: File) => void;
}

export const FileUploadZone = ({ uploading, onFileSelect }: FileUploadZoneProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    disabled: uploading,
    multiple: false,
    noClick: true // Disable click on the entire zone
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-8 transition-colors duration-200 ease-in-out
        ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-200 dark:border-gray-800'}
        ${uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-default'}
      `}
    >
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="p-4 bg-primary/10 rounded-full">
          {isDragActive ? (
            <Upload className="h-6 w-6 text-primary animate-bounce" />
          ) : (
            <FileUp className="h-6 w-6 text-primary" />
          )}
        </div>
        
        <div className="text-center">
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="text-sm text-muted-foreground">Drop the file here</p>
          ) : (
            <>
              <p className="text-sm font-medium">
                {uploading ? "Uploading..." : "Drop file here or click to upload"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Support for documents, images, and PDFs
              </p>
            </>
          )}
        </div>

        <Button 
          variant="outline" 
          disabled={uploading} 
          type="button" 
          onClick={(e) => {
            e.stopPropagation();
            open();
          }}
        >
          <FileUp className="h-4 w-4 mr-2" />
          Browse Files
        </Button>
      </div>
    </div>
  );
};