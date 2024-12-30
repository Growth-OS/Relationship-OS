import { useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FileUploader } from "./chat/FileUploader";
import { ChatMessages } from "./chat/ChatMessages";

interface DashboardChatProps {
  projectId: string | null;
}

export const DashboardChat = ({ projectId }: DashboardChatProps) => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; url: string }[]>([]);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!message.trim() && uploadedFiles.length === 0) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('chat-with-data', {
        body: {
          message,
          files: uploadedFiles,
          projectId,
        },
      });

      if (error) throw error;

      // Clear message and files but don't affect projectId
      setMessage("");
      setUploadedFiles([]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = useCallback(async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = projectId 
        ? `projects/${projectId}/${fileName}`
        : `general/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('chat_files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('chat_files')
        .getPublicUrl(filePath);

      setUploadedFiles(prev => [...prev, { name: file.name, url: publicUrl }]);

      toast({
        title: "File uploaded",
        description: "Your file has been uploaded successfully.",
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Error",
        description: "Failed to upload file. Please try again.",
        variant: "destructive",
      });
    }
  }, [projectId, toast]);

  const removeFile = (fileName: string) => {
    setUploadedFiles(prev => prev.filter(file => file.name !== fileName));
  };

  return (
    <Card className="flex flex-col h-[600px] p-4">
      <div className="flex-1 overflow-y-auto mb-4">
        <ChatMessages projectId={projectId} />
      </div>

      <div className="space-y-2">
        {uploadedFiles.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {uploadedFiles.map((file) => (
              <div
                key={file.name}
                className="flex items-center gap-2 bg-secondary p-2 rounded-md"
              >
                <span className="text-sm">{file.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => removeFile(file.name)}
                >
                  <span className="sr-only">Remove file</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <FileUploader onUpload={handleFileUpload} />
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Ask me anything${projectId ? ' about this project' : ''}...`}
              className="flex-1 bg-background rounded-md border px-3 py-2"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || (!message.trim() && uploadedFiles.length === 0)}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};