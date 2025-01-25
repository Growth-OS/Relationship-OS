import { useProjectFiles } from "./files/useProjectFiles";
import { FileUploadZone } from "./files/FileUploadZone";
import { FileGrid } from "./files/FileGrid";
import { Progress } from "@/components/ui/progress";

export const ProjectFiles = ({ projectId }: { projectId: string }) => {
  const {
    files,
    uploading,
    uploadProgress,
    handleFileUpload,
    handleDownload,
    handleDelete,
  } = useProjectFiles(projectId);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <FileUploadZone 
        uploading={uploading} 
        onFileSelect={handleFileUpload}
        uploadProgress={uploadProgress}
      />

      {uploading && (
        <div className="space-y-2">
          <Progress value={uploadProgress} className="h-2" />
          <p className="text-sm text-muted-foreground text-center">
            Uploading... {uploadProgress}%
          </p>
        </div>
      )}

      <FileGrid 
        files={files}
        onDownload={handleDownload}
        onDelete={handleDelete}
      />
    </div>
  );
};