import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AddProspectActionProps {
  fromEmail: string;
}

export const AddProspectAction = ({ fromEmail }: AddProspectActionProps) => {
  const handleAddProspect = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('You must be logged in to add prospects');
        return;
      }

      const { error } = await supabase
        .from('prospects')
        .insert({
          company_name: fromEmail.split('@')[1] || fromEmail,
          contact_email: fromEmail,
          source: 'email',
          user_id: user.id,
        });

      if (error) throw error;

      toast.success('Prospect created successfully');
    } catch (error) {
      console.error('Error adding prospect:', error);
      toast.error('Error adding prospect');
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-gray-600 hover:text-gray-900 hover:bg-gray-50"
      onClick={handleAddProspect}
    >
      <UserPlus className="h-4 w-4 mr-2" />
      Add as Prospect
    </Button>
  );
};