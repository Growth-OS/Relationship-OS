import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export const LogoUpload = () => {
  return (
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
  );
};