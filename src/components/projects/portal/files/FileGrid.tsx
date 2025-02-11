import { FileCard } from "./FileCard";

interface FileGridProps {
  files: Array<{
    id: string;
    title: string;
    created_at: string;
    file_path: string;
    file_type: string;
  }>;
  onDownload: (file: any) => void;
  onDelete: (fileId: string, filePath: string) => void;
}

export const FileGrid = ({ files, onDownload, onDelete }: FileGridProps) => {
  if (files.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
        <p className="text-muted-foreground">No files uploaded yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {files.map((file) => (
        <FileCard
          key={file.id}
          file={file}
          onDownload={onDownload}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};