import { Button } from "@/components/ui/button";
import { Download, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface FileListItemProps {
  file: {
    id: string;
    title: string;
    created_at: string;
    file_path: string;
  };
  onDownload: (file: any) => void;
  onDelete: (fileId: string, filePath: string) => void;
}

export const FileListItem = ({ file, onDownload, onDelete }: FileListItemProps) => {
  return (
    <div className="flex items-center justify-between border p-4 rounded-lg">
      <div>
        <h3 className="font-medium">{file.title}</h3>
        <p className="text-sm text-gray-500">
          Uploaded on {format(new Date(file.created_at), "PPP")}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onDownload(file)}
        >
          <Download className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onDelete(file.id, file.file_path)}
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </div>
    </div>
  );
};