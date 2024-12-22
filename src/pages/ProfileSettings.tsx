import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ProfileSettings = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Profile Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Manage your personal information and account settings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Profile settings form will be added here in the future */}
          <p className="text-muted-foreground">Profile settings coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettings;