import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export const Typography = () => {
  return (
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
  );
};