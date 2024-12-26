import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff, Plus } from "lucide-react";

interface Credential {
  id: string;
  service_name: string;
  username: string;
  password: string;
}

export const ProjectCredentials = ({ projectId }: { projectId: string }) => {
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [newCredential, setNewCredential] = useState({
    service_name: "",
    username: "",
    password: "",
  });

  const { data: credentials = [], refetch } = useQuery({
    queryKey: ["project-credentials", projectId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user");

      const { data, error } = await supabase
        .from("project_credentials")
        .select("*")
        .eq("project_id", projectId)
        .eq("user_id", user.id);

      if (error) throw error;
      return data as Credential[];
    },
  });

  const handleAddCredential = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user");

      const { error } = await supabase
        .from("project_credentials")
        .insert({
          project_id: projectId,
          user_id: user.id,
          ...newCredential,
        });

      if (error) throw error;

      toast.success("Credentials added successfully");
      setNewCredential({ service_name: "", username: "", password: "" });
      refetch();
    } catch (error) {
      console.error("Error adding credentials:", error);
      toast.error("Failed to add credentials");
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {credentials.map((credential) => (
          <div key={credential.id} className="border p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">{credential.service_name}</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => 
                  setShowPasswords(prev => ({
                    ...prev,
                    [credential.id]: !prev[credential.id]
                  }))
                }
              >
                {showPasswords[credential.id] ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="grid gap-2">
              <div>
                <Label>Username</Label>
                <Input value={credential.username} readOnly />
              </div>
              <div>
                <Label>Password</Label>
                <Input
                  type={showPasswords[credential.id] ? "text" : "password"}
                  value={credential.password}
                  readOnly
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t pt-6">
        <h3 className="font-medium mb-4">Add New Credentials</h3>
        <div className="grid gap-4">
          <div>
            <Label>Service Name</Label>
            <Input
              value={newCredential.service_name}
              onChange={(e) =>
                setNewCredential((prev) => ({
                  ...prev,
                  service_name: e.target.value,
                }))
              }
            />
          </div>
          <div>
            <Label>Username</Label>
            <Input
              value={newCredential.username}
              onChange={(e) =>
                setNewCredential((prev) => ({
                  ...prev,
                  username: e.target.value,
                }))
              }
            />
          </div>
          <div>
            <Label>Password</Label>
            <Input
              type="password"
              value={newCredential.password}
              onChange={(e) =>
                setNewCredential((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
            />
          </div>
          <Button onClick={handleAddCredential}>
            <Plus className="h-4 w-4 mr-2" />
            Add Credentials
          </Button>
        </div>
      </div>
    </div>
  );
};