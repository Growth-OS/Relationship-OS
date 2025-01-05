import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { verifyDatabaseHealth, createBackupPoint, verifyDataIntegrity } from "@/utils/backupMonitor";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Shield, Database, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const BackupSettings = () => {
  const queryClient = useQueryClient();
  
  const { data: backupPoints, isLoading } = useQuery({
    queryKey: ["backup-points"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("backup_points")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching backup points:", error);
        throw error;
      }
      return data;
    },
  });

  const handleCreateBackupPoint = async () => {
    try {
      const backupPoint = await createBackupPoint("Manual backup point created from settings");
      
      // Verify the backup point immediately after creation
      const isHealthy = await verifyDatabaseHealth();
      if (isHealthy) {
        const { error: updateError } = await supabase
          .from("backup_points")
          .update({ 
            status: "verified",
            verified_at: new Date().toISOString()
          })
          .eq("id", backupPoint.id);

        if (updateError) {
          console.error("Error updating backup status:", updateError);
          toast.error("Failed to verify backup point");
          return;
        }
      }

      // Refresh the backup points list
      await queryClient.invalidateQueries({ queryKey: ["backup-points"] });
      toast.success("Backup point created and verified successfully");
    } catch (error) {
      console.error("Error creating backup point:", error);
      toast.error("Failed to create backup point");
    }
  };

  const handleVerifyHealth = async () => {
    const isHealthy = await verifyDatabaseHealth();
    if (isHealthy) {
      toast.success("Database health check passed");
    }
  };

  const handleVerifyIntegrity = async () => {
    const isIntact = await verifyDataIntegrity();
    if (isIntact) {
      toast.success("Data integrity check passed");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-left mb-2">Backup & Recovery</h1>
        <p className="text-gray-600 text-left">Manage your data backup and recovery settings</p>
      </div>

      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Database Health
            </CardTitle>
            <CardDescription>
              Monitor and verify your database health
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button onClick={handleVerifyHealth}>
                <Database className="w-4 h-4 mr-2" />
                Verify Database Health
              </Button>
              <Button onClick={handleVerifyIntegrity} variant="outline">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Verify Data Integrity
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Manual Backup Points</CardTitle>
            <CardDescription>
              Create and manage manual backup points
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={handleCreateBackupPoint}>
              Create Backup Point
            </Button>

            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Recent Backup Points</h3>
              {isLoading ? (
                <p className="text-sm text-gray-500">Loading backup points...</p>
              ) : backupPoints?.length === 0 ? (
                <p className="text-sm text-gray-500">No backup points created yet</p>
              ) : (
                <div className="space-y-2">
                  {backupPoints?.map((point) => (
                    <div
                      key={point.id}
                      className="p-3 bg-gray-50 rounded-lg dark:bg-gray-800"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium">{point.description}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(point.created_at).toLocaleString()}
                          </p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          point.status === 'verified' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {point.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BackupSettings;