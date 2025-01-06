import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FileUp, Download, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface ProjectFile {
  id: string;
  title: string;
  file_path: string;
  file_type: string;
  created_at: string;
}

export const ProjectFiles = ({ projectId }: { projectId: string }) => {
  const [uploading, setUploading] = useState(false);

  const { data: files = [], refetch } = useQuery({
    queryKey: ["project-files", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_documents")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as ProjectFile[];
    },
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user");

      setUploading(true);
      
      // Generate a unique filename
      const fileExt = file.name.split(".").pop();
      const filePath = `${Math.random()}.${fileExt}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from("project_files")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Create database record
      const { error: dbError } = await supabase.from("project_documents").insert({
        project_id: projectId,
        user_id: user.id,
        title: file.name,
        file_path: filePath,
        file_type: file.type,
      });

      if (dbError) throw dbError;

      toast.success("File uploaded successfully");
      refetch();
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (file: ProjectFile) => {
    try {
      const { data, error } = await supabase.storage
        .from("project_files")
        .download(file.file_path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.title;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Failed to download file");
    }
  };

  const handleDelete = async (fileId: string, filePath: string) => {
    try {
      const { error: storageError } = await supabase.storage
        .from("project_files")
        .remove([filePath]);

      if (storageError) throw storageError;

      const { error: dbError } = await supabase
        .from("project_documents")
        .delete()
        .eq("id", fileId);

      if (dbError) throw dbError;

      toast.success("File deleted successfully");
      refetch();
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Failed to delete file");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button disabled={uploading}>
          <FileUp className="h-4 w-4 mr-2" />
          <label className="cursor-pointer">
            Upload File
            <input
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              disabled={uploading}
            />
          </label>
        </Button>
      </div>

      <div className="grid gap-4">
        {files.map((file) => (
          <div
            key={file.id}
            className="flex items-center justify-between border p-4 rounded-lg"
          >
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
                onClick={() => handleDownload(file)}
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleDelete(file.id, file.file_path)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        {files.length === 0 && (
          <p className="text-center text-gray-500 py-8">No files uploaded yet</p>
        )}
      </div>
    </div>
  );
};