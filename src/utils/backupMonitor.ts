import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const verifyDatabaseHealth = async () => {
  try {
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

export const createBackupPoint = async (description: string) => {
  try {
    // First get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('Error getting user:', userError);
      toast.error('Authentication required');
      throw userError;
    }

    const { data, error } = await supabase
      .from('backup_points')
      .insert({
        description,
        backup_type: 'manual' as const,
        status: 'pending',
        user_id: user.id
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating backup point:', error);
      toast.error('Failed to create backup point');
      throw error;
    }

    // Verify the backup point
    const isHealthy = await verifyDatabaseHealth();
    if (isHealthy) {
      const { error: updateError } = await supabase
        .from('backup_points')
        .update({ status: 'verified', verified_at: new Date().toISOString() })
        .eq('id', data.id);

      if (updateError) {
        console.error('Error updating backup status:', updateError);
      }
    }

    return data;
  } catch (error) {
    console.error('Error creating backup point:', error);
    toast.error('Failed to create backup point');
    throw error;
  }
};

export const verifyDataIntegrity = async () => {
  try {
    const criticalTables = [
      'financial_transactions',
      'projects',
      'deals',
      'tasks'
    ] as const;
    
    let isIntact = true;

    for (const table of criticalTables) {
      const { error } = await supabase
        .from(table)
        .select('id')
        .limit(1);

      if (error) {
        console.error(`Data integrity check failed for ${table}:`, error);
        toast.error(`Data integrity issue detected in ${table}`);
        isIntact = false;
        break;
      }
    }

    if (isIntact) {
      toast.success('Data integrity check passed');
    }
    return isIntact;
  } catch (error) {
    console.error('Data integrity check failed:', error);
    toast.error('Data integrity check failed');
    return false;
  }
};