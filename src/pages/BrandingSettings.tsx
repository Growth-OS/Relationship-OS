import { LogoUpload } from "@/components/settings/branding/LogoUpload";
import { Typography } from "@/components/settings/branding/Typography";

const BrandingSettings = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-left mb-2">Branding</h1>
        <p className="text-gray-600 text-left">Customize your brand appearance</p>
      </div>
      
      <div className="grid gap-8">
        <LogoUpload />
        <Typography />
      </div>
    </div>
  );
};

export default BrandingSettings;
