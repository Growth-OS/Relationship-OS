import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useFileUpload } from "./useFileUpload";
import { useFileOperations } from "./useFileOperations";

export const useProjectFiles = (projectId: string) => {
  const queryClient = useQueryClient();

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

  const { uploading, uploadProgress, handleFileUpload } = useFileUpload(
    projectId,
    () => queryClient.invalidateQueries({ queryKey: ["project-files"] })
  );

  const { handleDownload, handleDelete } = useFileOperations();

  return {
    files,
    uploading,
    uploadProgress,
    handleFileUpload,
    handleDownload,
    handleDelete,
  };
};