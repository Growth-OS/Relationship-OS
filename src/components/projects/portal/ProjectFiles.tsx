import { useProjectFiles } from "./files/useProjectFiles";
import { FileUploadButton } from "./files/FileUploadButton";
import { FileListItem } from "./files/FileListItem";

export const ProjectFiles = ({ projectId }: { projectId: string }) => {
  const {
    files,
    uploading,
    handleFileUpload,
    handleDownload,
    handleDelete,
  } = useProjectFiles(projectId);

  return (
    <div className="space-y-6">
      <FileUploadButton 
        uploading={uploading} 
        onFileSelect={handleFileUpload} 
      />

      <div className="grid gap-4">
        {files.map((file) => (
          <FileListItem
            key={file.id}
            file={file}
            onDownload={handleDownload}
            onDelete={handleDelete}
          />
        ))}
        {files.length === 0 && (
          <p className="text-center text-gray-500 py-8">No files uploaded yet</p>
        )}
      </div>
    </div>
  );
};