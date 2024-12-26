import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export const ColorPalette = () => {
  return (
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
  );
};