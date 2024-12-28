import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const ConnectedServices = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Connected Services</CardTitle>
        <CardDescription>
          Manage your connected services and integrations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">No services connected yet.</p>
      </CardContent>
    </Card>
  );
};