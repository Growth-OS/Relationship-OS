import { Button } from "@/components/ui/button";
import { FileUp } from "lucide-react";

interface FileUploadButtonProps {
  uploading: boolean;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FileUploadButton = ({ uploading, onFileSelect }: FileUploadButtonProps) => {
  return (
    <div className="flex justify-end">
      <Button disabled={uploading}>
        <FileUp className="h-4 w-4 mr-2" />
        <label className="cursor-pointer">
          {uploading ? "Uploading..." : "Upload File"}
          <input
            type="file"
            className="hidden"
            onChange={onFileSelect}
            disabled={uploading}
          />
        </label>
      </Button>
    </div>
  );
};