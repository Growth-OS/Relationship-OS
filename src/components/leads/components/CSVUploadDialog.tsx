import { useState, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UploadForm } from "./csv-upload/UploadForm";
import { UploadErrors } from "./csv-upload/UploadErrors";
import { FormatGuidelines } from "./csv-upload/FormatGuidelines";

interface CSVUploadDialogProps {
  onSuccess: () => void;
}

const formatUrl = (url: string): string => {
  if (!url) return '';
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }
  return url.replace(/\/+$/, '');
};

export const CSVUploadDialog = ({ onSuccess }: CSVUploadDialogProps) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const processCSV = async (file: File) => {
    setUploading(true);
    setProgress(0);
    setErrors([]);

    try {
      const text = await file.text();
      const rows = text.split('\n').map(row => row.split(','));
      const headers = rows[0].map(header => header.trim().toLowerCase());

      const requiredFields = ['email', 'first name'];
      const missingFields = requiredFields.filter(field => !headers.includes(field));
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required columns: ${missingFields.join(', ')}`);
      }

      const leads = [];
      const newErrors = [];

      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (row.length !== headers.length) continue;

        const lead: Record<string, any> = {};
        let hasError = false;

        headers.forEach((header, index) => {
          const value = row[index].trim();
          lead[header] = value || null;
        });

        if (!validateEmail(lead.email)) {
          newErrors.push(`Row ${i}: Invalid email address - ${lead.email}`);
          hasError = true;
        }

        if (!lead['first name']) {
          newErrors.push(`Row ${i}: Missing first name`);
          hasError = true;
        }

        if (!hasError) {
          leads.push({
            company_name: lead['company name'] || lead.company || '',
            contact_email: lead.email,
            first_name: lead['first name'],
            company_website: lead.website || lead['company website'] || '',
            contact_linkedin: lead.linkedin || lead['linkedin profile'] || '',
            contact_job_title: lead['job title'] || lead.position || '',
            notes: lead.notes || lead.note || lead.other || '',
            source: lead.source && ['website', 'referral', 'linkedin', 'cold_outreach', 'conference', 'accelerator', 'other'].includes(lead.source.toLowerCase()) 
              ? lead.source.toLowerCase() 
              : 'other',
            status: 'new'
          });
        }

        setProgress(Math.round((i / rows.length) * 100));
      }

      setErrors(newErrors);

      if (leads.length > 0) {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          throw new Error('You must be logged in to upload leads');
        }

        const batchSize = 100;
        for (let i = 0; i < leads.length; i += batchSize) {
          const batch = leads.slice(i, i + batchSize).map(lead => ({
            ...lead,
            user_id: user.id
          }));

          const { error: insertError } = await supabase
            .from('leads')
            .insert(batch);

          if (insertError) throw insertError;
        }

        toast.success(`Successfully uploaded ${leads.length} leads`);
        setUploading(false);
        onSuccess();
      }
    } catch (error) {
      console.error('Error processing CSV:', error);
      toast.error('Failed to process CSV file');
      setErrors(prev => [...prev, error.message]);
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <UploadForm 
        uploading={uploading}
        progress={progress}
        onFileSelect={processCSV}
      />
      <UploadErrors errors={errors} />
      <FormatGuidelines />
    </div>
  );
};