import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { UploadForm } from "./csv-upload/UploadForm";
import { UploadErrors } from "./csv-upload/UploadErrors";
import { FormatGuidelines } from "./csv-upload/FormatGuidelines";

interface CSVUploadDialogProps {
  projectId: string;
  onSuccess?: () => void;
}

export const CSVUploadDialog = ({ projectId, onSuccess }: CSVUploadDialogProps) => {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);

  const processCSV = async (file: File) => {
    setUploading(true);
    setProgress(0);
    setErrors([]);

    try {
      const text = await file.text();
      const rows = text.split('\n').map(row => row.split(','));
      const headers = rows[0].map(header => header.trim().toLowerCase());

      const requiredFields = ['title'];
      const missingFields = requiredFields.filter(field => !headers.includes(field));
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required columns: ${missingFields.join(', ')}`);
      }

      const tasks = [];
      const newErrors = [];

      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (row.length !== headers.length) continue;

        const task: Record<string, any> = {};
        let hasError = false;

        headers.forEach((header, index) => {
          const value = row[index].trim();
          task[header] = value || null;
        });

        if (!task.title) {
          newErrors.push(`Row ${i}: Missing title`);
          hasError = true;
        }

        if (!hasError) {
          tasks.push({
            title: task.title,
            description: task.description || '',
            due_date: task.due_date || null,
            priority: task.priority || 'medium',
            source: 'projects',
            project_id: projectId,
          });
        }

        setProgress(Math.round((i / rows.length) * 100));
      }

      setErrors(newErrors);

      if (tasks.length > 0) {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          throw new Error('You must be logged in to upload tasks');
        }

        const batchSize = 100;
        for (let i = 0; i < tasks.length; i += batchSize) {
          const batch = tasks.slice(i, i + batchSize).map(task => ({
            ...task,
            user_id: user.id
          }));

          const { error: insertError } = await supabase
            .from('tasks')
            .insert(batch);

          if (insertError) throw insertError;
        }

        toast.success(`Successfully uploaded ${tasks.length} tasks`);
        setOpen(false);
        onSuccess?.();
      }
    } catch (error) {
      console.error('Error processing CSV:', error);
      toast.error('Failed to process CSV file');
      setErrors(prev => [...prev, error.message]);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Upload className="h-4 w-4 mr-2" />
          Import Tasks
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Tasks from CSV</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <UploadForm 
            uploading={uploading}
            progress={progress}
            onFileSelect={processCSV}
          />
          <UploadErrors errors={errors} />
          <FormatGuidelines />
        </div>
      </DialogContent>
    </Dialog>
  );
};