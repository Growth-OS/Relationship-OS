import { Button } from "@/components/ui/button";
import { Play, Pause, Settings, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DeleteSequenceDialog } from "./DeleteSequenceDialog";

interface SequenceActionsProps {
  sequenceId: string;
  status: string;
  isUpdating: boolean;
  onStatusChange: (newStatus: 'active' | 'paused') => Promise<void>;
  onDelete: () => Promise<void>;
}

export const SequenceActions = ({ 
  sequenceId, 
  status, 
  isUpdating,
  onStatusChange,
  onDelete 
}: SequenceActionsProps) => {
  const navigate = useNavigate();

  return (
    <div className="space-x-2">
      {isUpdating ? (
        <Button 
          variant="ghost" 
          size="icon"
          disabled
        >
          <Loader2 className="h-4 w-4 animate-spin" />
        </Button>
      ) : status === "active" ? (
        <Button 
          variant="ghost" 
          size="icon" 
          title="Pause sequence"
          onClick={() => onStatusChange('paused')}
        >
          <Pause className="h-4 w-4" />
        </Button>
      ) : (
        <Button 
          variant="ghost" 
          size="icon" 
          title="Activate sequence"
          onClick={() => onStatusChange('active')}
        >
          <Play className="h-4 w-4" />
        </Button>
      )}
      <Button 
        variant="ghost" 
        size="icon" 
        title="Sequence settings"
        onClick={() => navigate(`/dashboard/sequences/${sequenceId}/edit`)}
      >
        <Settings className="h-4 w-4" />
      </Button>
      <DeleteSequenceDialog onDelete={onDelete} />
    </div>
  );
};