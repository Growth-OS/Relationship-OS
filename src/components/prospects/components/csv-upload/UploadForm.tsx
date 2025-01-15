import { useDropzone } from 'react-dropzone';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload } from "lucide-react";

interface UploadFormProps {
  uploading: boolean;
  progress: number;
  onUpload: (files: File[]) => void;
}

export const UploadForm = ({ uploading, progress, onUpload }: UploadFormProps) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onUpload,
    accept: {
      'text/csv': ['.csv']
    },
    multiple: false
  });

  return (
    <>
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors duration-200
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300'}
          ${uploading ? 'pointer-events-none opacity-50' : ''}
        `}
      >
        <input {...getInputProps()} />
        <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <p className="text-sm text-gray-600">
          {isDragActive
            ? "Drop the CSV file here"
            : "Drag and drop your CSV file here, or click to select"}
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Only CSV files are supported
        </p>
      </div>

      {uploading && (
        <div className="space-y-2">
          <Progress value={progress} />
          <p className="text-sm text-gray-600 text-center">
            Processing... {progress}%
          </p>
        </div>
      )}
    </>
  );
};