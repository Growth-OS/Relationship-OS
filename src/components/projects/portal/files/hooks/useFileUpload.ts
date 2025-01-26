import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useFileUpload = (projectId: string, onSuccess: () => void) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const simulateProgress = (onComplete: () => void) => {
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return prev;
        }
        return prev + 10;
      });
    }, 500);
    return interval;
  };

  const handleFileUpload = async (file: File) => {
    try {
      setUploading(true);
      setUploadProgress(0);

      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${projectId}/${fileName}`;

      // Create a channel for upload progress
      const channel = supabase.channel('upload-progress');
      
      // Start progress simulation
      const progressInterval = simulateProgress(() => setUploadProgress(100));

      const uploadPromise = new Promise<void>(async (resolve, reject) => {
        channel.subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            const uploadResult = await supabase.storage
              .from("project_files")
              .upload(filePath, file, {
                cacheControl: "3600",
                upsert: false
              });

            if (uploadResult.error) {
              reject(uploadResult.error);
              return;
            }

            // Create document record
            const { error: dbError } = await supabase.from("project_documents").insert({
              project_id: projectId,
              title: file.name,
              file_path: filePath,
              file_type: file.type,
              user_id: (await supabase.auth.getUser()).data.user?.id,
            });

            if (dbError) {
              reject(dbError);
              return;
            }

            resolve();
          }
        });
      });

      await uploadPromise;
      clearInterval(progressInterval);
      setUploadProgress(100);
      onSuccess();
      
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

  return {
    uploading,
    uploadProgress,
    handleFileUpload,
  };
};