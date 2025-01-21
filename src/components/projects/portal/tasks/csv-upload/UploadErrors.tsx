import { AlertCircle } from "lucide-react";

interface UploadErrorsProps {
  errors: string[];
}

export const UploadErrors = ({ errors }: UploadErrorsProps) => {
  if (errors.length === 0) return null;

  return (
    <div className="rounded-lg bg-red-50 p-4 space-y-2">
      <div className="flex items-center gap-2 text-red-800">
        <AlertCircle className="w-4 h-4" />
        <h4 className="font-medium">Upload Errors</h4>
      </div>
      <ul className="list-disc list-inside space-y-1">
        {errors.map((error, index) => (
          <li key={index} className="text-sm text-red-700">
            {error}
          </li>
        ))}
      </ul>
    </div>
  );
};