import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface UploadInterfaceProps {
  uploading: boolean;
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const UploadInterface = ({ uploading, onUpload }: UploadInterfaceProps) => {
  return (
    <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
      <div className="space-y-2">
        <div className="text-gray-500">
          Drag and drop your brand book PDF here, or click to browse
        </div>
        <div>
          <Input
            type="file"
            accept=".pdf"
            onChange={onUpload}
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
  );
};