import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useFileOperations = () => {
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
      toast.error("Failed to download file", {
        description: error.message || "An unexpected error occurred"
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

      toast.success("File deleted successfully");
    } catch (error: any) {
      console.error("Error deleting file:", error);
      toast.error("Failed to delete file", {
        description: error.message || "An unexpected error occurred"
      });
    }
  };

  return {
    handleDownload,
    handleDelete,
  };
};