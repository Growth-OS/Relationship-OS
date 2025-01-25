import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { 
  Download, 
  File, 
  FileAudio, 
  FileImage, 
  FileVideo, 
  Trash 
} from "lucide-react";
import { format } from "date-fns";

interface FileCardProps {
  file: {
    id: string;
    title: string;
    created_at: string;
    file_path: string;
    file_type: string;
  };
  onDownload: (file: any) => void;
  onDelete: (fileId: string, filePath: string) => void;
}

export const FileCard = ({ file, onDownload, onDelete }: FileCardProps) => {
  const getFileIcon = () => {
    if (file.file_type.startsWith('image/')) return FileImage;
    if (file.file_type.startsWith('video/')) return FileVideo;
    if (file.file_type.startsWith('audio/')) return FileAudio;
    return File;
  };

  const FileIcon = getFileIcon();

  return (
    <Card className="group hover:shadow-md transition-shadow duration-200">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full">
            <FileIcon className="h-8 w-8 text-primary" />
          </div>
          <div className="text-center">
            <h3 className="font-medium truncate max-w-[200px]" title={file.title}>
              {file.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {format(new Date(file.created_at), "PPP")}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDownload(file)}
        >
          <Download className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(file.id, file.file_path)}
        >
          <Trash className="h-4 w-4 text-destructive" />
        </Button>
      </CardFooter>
    </Card>
  );
};