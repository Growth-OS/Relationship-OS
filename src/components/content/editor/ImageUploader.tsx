import { ChangeEvent } from "react";
import { Editor } from '@tiptap/react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface ImageUploaderProps {
  editor: Editor;
}

export const ImageUploader = ({ editor }: ImageUploaderProps) => {
  const { toast } = useToast();

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { data, error } = await supabase.storage
        .from('post_images')
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('post_images')
        .getPublicUrl(fileName);

      editor.chain().focus().setImage({ src: publicUrl }).run();

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    }
  };

  return (
    <input
      type="file"
      id="image-upload"
      className="hidden"
      accept="image/*"
      onChange={handleImageUpload}
    />
  );
};