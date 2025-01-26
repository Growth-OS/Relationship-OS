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

      const timestamp = new Date().getTime();
      const randomString = Math.random().toString(36).substring(2, 15);
      const fileExt = file.name.split(".").pop();
      const fileName = `${timestamp}-${randomString}.${fileExt}`;
      const filePath = `${projectId}/${fileName}`;

      // Create a channel for upload progress
      const channel = supabase.channel('upload-progress');
      
      channel.subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          const uploadResult = await supabase.storage
            .from("project_files")
            .upload(filePath, file, {
              cacheControl: "3600",
              upsert: true // Changed to true to handle duplicate files
            });

          if (uploadResult.error) throw uploadResult.error;
        }
      });

      // Simulate progress since we can't get real progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return prev;
          }
          return prev + 10;
        });
      }, 500);

      const { error: dbError } = await supabase.from("project_documents").insert({
        project_id: projectId,
        title: file.name,
        file_path: filePath,
        file_type: file.type,
        user_id: (await supabase.auth.getUser()).data.user?.id,
      });

      if (dbError) throw dbError;

      // Clean up
      clearInterval(interval);
      setUploadProgress(100);
      
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

  const handleDownload = async (file: any) => {
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
      const { error: storageError } = await supabase.storage
        .from("project_files")
        .remove([filePath]);

      if (storageError) throw storageError;

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