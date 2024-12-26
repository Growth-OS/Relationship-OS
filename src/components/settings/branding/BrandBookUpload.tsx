import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FileText, Trash2, Download } from "lucide-react";

interface UploadedFile {
  name: string;
  url: string;
}

export const BrandBookUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  useEffect(() => {
    loadUploadedFiles();
  }, []);

  const loadUploadedFiles = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase.storage
        .from('financial_docs')
        .list(user.id + '/');

      if (error) throw error;

      const files = await Promise.all(
        (data || []).map(async (file) => {
          const { data: { publicUrl } } = supabase.storage
            .from('financial_docs')
            .getPublicUrl(`${user.id}/${file.name}`);

          return {
            name: file.name,
            url: publicUrl
          };
        })
      );

      setUploadedFiles(files);
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
      await loadUploadedFiles(); // Refresh the file list
    } catch (error) {
      console.error('Error uploading brand book:', error);
      toast.error('Failed to upload brand book');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (fileName: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.storage
        .from('financial_docs')
        .remove([`${user.id}/${fileName}`]);

      if (error) throw error;

      toast.success('File deleted successfully');
      await loadUploadedFiles(); // Refresh the file list
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
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
            <div className="space-y-2">
              <div className="text-gray-500">
                Drag and drop your brand book PDF here, or click to browse
              </div>
              <div>
                <Input
                  type="file"
                  accept=".pdf"
                  onChange={handleBrandBookUpload}
                  className="hidden"
                  id="brand-book-upload"
                />
                <Button
                  variant="secondary"
                  onClick={() => document.getElementById('brand-book-upload')?.click()}
                  disabled={uploading}
                >
                  {uploading ? 'Uploading...' : 'Upload Brand Book'}
                </Button>
              </div>
            </div>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-3">Uploaded Files</h3>
              <div className="space-y-2">
                {uploadedFiles.map((file) => (
                  <div
                    key={file.name}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{file.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(file.url, '_blank')}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(file.name)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};