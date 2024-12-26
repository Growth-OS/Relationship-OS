import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
                    <Button variant="secondary">Upload Brand Book</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Logo</CardTitle>
              <CardDescription>
                Upload and manage your brand logos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label>Primary Logo</Label>
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                    <Button variant="secondary">Upload Primary Logo</Button>
                  </div>
                </div>
                <div className="space-y-4">
                  <Label>Secondary Logo</Label>
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                    <Button variant="secondary">Upload Secondary Logo</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="colors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Color Palette</CardTitle>
              <CardDescription>
                Define your brand's color scheme
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label>Primary Color</Label>
                  <div className="flex gap-2">
                    <Input type="color" className="w-16 h-10" />
                    <Input placeholder="#000000" />
                  </div>
                </div>
                <div className="space-y-4">
                  <Label>Secondary Color</Label>
                  <div className="flex gap-2">
                    <Input type="color" className="w-16 h-10" />
                    <Input placeholder="#000000" />
                  </div>
                </div>
                <div className="space-y-4">
                  <Label>Accent Color</Label>
                  <div className="flex gap-2">
                    <Input type="color" className="w-16 h-10" />
                    <Input placeholder="#000000" />
                  </div>
                </div>
                <div className="space-y-4">
                  <Label>Text Color</Label>
                  <div className="flex gap-2">
                    <Input type="color" className="w-16 h-10" />
                    <Input placeholder="#000000" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="typography" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Typography</CardTitle>
              <CardDescription>
                Specify your brand's typography settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label>Primary Font</Label>
                  <Input placeholder="Inter" />
                </div>
                <div className="space-y-4">
                  <Label>Secondary Font</Label>
                  <Input placeholder="Sans-serif" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Label>Heading Font Size</Label>
                    <Input type="number" placeholder="32" />
                  </div>
                  <div className="space-y-4">
                    <Label>Body Font Size</Label>
                    <Input type="number" placeholder="16" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BrandingSettings;