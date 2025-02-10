import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useProjectFiles = (projectId: string) => {
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
      return data;
    },
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user");

      setUploading(true);

      const { data: document, error: dbError } = await supabase
        .from("project_documents")
        .insert({
          project_id: projectId,
          user_id: user.id,
          title: file.name,
          file_path: '',
          file_type: file.type,
        })
        .select()
        .single();

      if (dbError) {
        throw new Error(`Database record creation failed: ${dbError.message}`);
      }

      const timestamp = new Date().getTime();
      const randomString = Math.random().toString(36).substring(2);
      const fileExt = file.name.split(".").pop();
      const filePath = `${projectId}/${timestamp}-${randomString}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("project_files")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false
        });

      if (uploadError) {
        await supabase
          .from("project_documents")
          .delete()
          .eq("id", document.id);
        throw new Error(`Storage upload failed: ${uploadError.message}`);
      }

      const { error: updateError } = await supabase
        .from("project_documents")
        .update({ file_path: filePath })
        .eq("id", document.id);

      if (updateError) {
        await supabase.storage
          .from("project_files")
          .remove([filePath]);
        await supabase
          .from("project_documents")
          .delete()
          .eq("id", document.id);
        throw new Error(`Database update failed: ${updateError.message}`);
      }

      toast.success("File uploaded successfully");
      refetch();
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error(error instanceof Error ? error.message : "Failed to upload file");
    } finally {
      setUploading(false);
      if (event.target) {
        event.target.value = '';
      }
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
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Failed to download file");
    }
  };

  const handleDelete = async (fileId: string, filePath: string) => {
    try {
      const { error: dbError } = await supabase
        .from("project_documents")
        .delete()
        .eq("id", fileId);

      if (dbError) throw dbError;

      const { error: storageError } = await supabase.storage
        .from("project_files")
        .remove([filePath]);

      if (storageError) throw storageError;

      toast.success("File deleted successfully");
      refetch();
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Failed to delete file");
    }
  };

  return {
    files,
    uploading,
    handleFileUpload,
    handleDownload,
    handleDelete,
  };
};