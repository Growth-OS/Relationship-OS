import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrandBookUpload } from "@/components/settings/branding/BrandBookUpload";
import { LogoUpload } from "@/components/settings/branding/LogoUpload";
import { ColorPalette } from "@/components/settings/branding/ColorPalette";
import { Typography } from "@/components/settings/branding/Typography";

const BrandingSettings = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Branding Settings</h1>
      
      <Tabs defaultValue="brand-book" className="space-y-4">
        <TabsList>
          <TabsTrigger value="brand-book">Brand Book</TabsTrigger>
          <TabsTrigger value="logo">Logo</TabsTrigger>
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="typography">Typography</TabsTrigger>
        </TabsList>

        <TabsContent value="brand-book" className="space-y-4">
          <BrandBookUpload />
        </TabsContent>

        <TabsContent value="logo" className="space-y-4">
          <LogoUpload />
        </TabsContent>

        <TabsContent value="colors" className="space-y-4">
          <ColorPalette />
        </TabsContent>

        <TabsContent value="typography" className="space-y-4">
          <Typography />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BrandingSettings;