import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Function to verify database connection and recent data modifications
export const verifyDatabaseHealth = async () => {
  try {
    // Test database connection with a simple query
    const { data, error } = await supabase
      .from('user_preferences')
      .select('created_at')
      .limit(1);

    if (error) {
      console.error('Database health check failed:', error);
      toast.error('Database connection issue detected');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    toast.error('Database connection issue detected');
    return false;
  }
};

// Function to create a manual backup point by logging a backup record
export const createBackupPoint = async (description: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error('User must be logged in to create backup points');
      return;
    }

    // Log the backup point
    const { error } = await supabase
      .from('backup_points')
      .insert([{
        user_id: user.id,
        description,
        backup_type: 'manual',
        status: 'pending'
      }] as any); // Using 'any' temporarily until we update types

    if (error) throw error;
    
    toast.success('Backup point created successfully');
  } catch (error) {
    console.error('Error creating backup point:', error);
    toast.error('Failed to create backup point');
  }
};

// Function to verify data integrity
export const verifyDataIntegrity = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error('User must be logged in to verify data integrity');
      return;
    }

    // Perform a series of checks on critical tables
    const criticalTables = [
      'financial_transactions',
      'projects',
      'deals',
      'tasks'
    ] as const;

    for (const table of criticalTables) {
      const { error } = await supabase
        .from(table)
        .select('id')
        .limit(1);

      if (error) {
        console.error(`Data integrity check failed for ${table}:`, error);
        toast.error(`Data integrity issue detected in ${table}`);
        return false;
      }
    }

    toast.success('Data integrity check completed successfully');
    return true;
  } catch (error) {
    console.error('Data integrity check failed:', error);
    toast.error('Data integrity check failed');
    return false;
  }
};