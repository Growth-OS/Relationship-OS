import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const BrandBookUpload = () => {
  const [uploading, setUploading] = useState(false);

  const handleBrandBookUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      if (!file.type.includes('pdf')) {
        toast.error('Please upload a PDF file');
        return;
      }

      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to upload files');
        return;
      }

      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('financial_docs')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      toast.success('Brand book uploaded successfully');
    } catch (error) {
      console.error('Error uploading brand book:', error);
      toast.error('Failed to upload brand book');
    } finally {
      setUploading(false);
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
        </div>
      </CardContent>
    </Card>
  );
};