import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UploadInterface } from "./UploadInterface";
import { PDFPreview } from "./PDFPreview";

interface UploadedFile {
  name: string;
  url: string;
  path: string;
}

export const BrandBookUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);

  useEffect(() => {
    loadUploadedFile();
  }, []);

  const loadUploadedFile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase.storage
        .from('financial_docs')
        .list(user.id + '/');

      if (error) {
        console.error('Error loading files:', error);
        toast.error('Failed to load uploaded files');
        return;
      }

      if (data && data.length > 0) {
        const file = data[0]; // Get the first file
        const { data: { publicUrl } } = supabase.storage
          .from('financial_docs')
          .getPublicUrl(`${user.id}/${file.name}`);

        setUploadedFile({
          name: file.name,
          url: publicUrl,
          path: `${user.id}/${file.name}`
        });
      }
    } catch (error) {
      console.error('Error loading files:', error);
      toast.error('Failed to load uploaded files');
    }
  };

  const handleBrandBookUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      if (!file.type.includes('pdf')) {
        toast.error('Please upload a PDF file');
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to upload files');
        return;
      }

      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('financial_docs')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      toast.success('Brand book uploaded successfully');
      await loadUploadedFile();
    } catch (error) {
      console.error('Error uploading brand book:', error);
      toast.error('Failed to upload brand book');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!uploadedFile) return;

    try {
      const { error } = await supabase.storage
        .from('financial_docs')
        .remove([uploadedFile.path]);

      if (error) {
        console.error('Delete error:', error);
        toast.error('Failed to delete file');
        return;
      }

      toast.success('File deleted successfully');
      setUploadedFile(null);
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('Failed to delete file');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Brand Book</CardTitle>
        <CardDescription>
          Upload your brand book or style guide document
        </CardDescription>
      </CardHeader>
      <CardContent>
        {uploadedFile ? (
          <PDFPreview
            filePath={uploadedFile.path}
            fileName={uploadedFile.name}
            onDelete={handleDelete}
          />
        ) : (
          <UploadInterface
            uploading={uploading}
            onUpload={handleBrandBookUpload}
          />
        )}
      </CardContent>
    </Card>
  );
};