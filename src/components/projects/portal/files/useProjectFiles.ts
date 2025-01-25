import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useProjectFiles = (projectId: string) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: files = [] } = useQuery({
    queryKey: ["project-files", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_documents")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleFileUpload = async (file: File) => {
    try {
      setUploading(true);
      setUploadProgress(0);

      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${projectId}/${fileName}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from("project_files")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
          // Use a progress callback to track upload progress
          onUpload: (progress) => {
            if (progress.totalBytes > 0) {
              const percent = (progress.bytesUploaded / progress.totalBytes) * 100;
              setUploadProgress(Math.round(percent));
            }
          },
        });

      if (uploadError) throw uploadError;

      // Create document record in database
      const { error: dbError } = await supabase.from("project_documents").insert({
        project_id: projectId,
        title: file.name,
        file_path: filePath,
        file_type: fileExt,
      });

      if (dbError) throw dbError;

      queryClient.invalidateQueries({ queryKey: ["project-files"] });

      toast({
        title: "Success",
        description: "File uploaded successfully",
      });
    } catch (error: any) {
      console.error("Error uploading file:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload file",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDownload = async (filePath: string, fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from("project_files")
        .download(filePath);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error("Error downloading file:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to download file",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string, filePath: string) => {
    try {
      // Delete file from storage
      const { error: storageError } = await supabase.storage
        .from("project_files")
        .remove([filePath]);

      if (storageError) throw storageError;

      // Delete record from database
      const { error: dbError } = await supabase
        .from("project_documents")
        .delete()
        .eq("id", id);

      if (dbError) throw dbError;

      queryClient.invalidateQueries({ queryKey: ["project-files"] });

      toast({
        title: "Success",
        description: "File deleted successfully",
      });
    } catch (error: any) {
      console.error("Error deleting file:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete file",
        variant: "destructive",
      });
    }
  };

  return {
    files,
    uploading,
    uploadProgress,
    handleFileUpload,
    handleDownload,
    handleDelete,
  };
};