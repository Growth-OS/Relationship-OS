import { Button } from "@/components/ui/button";
import { Play, Pause, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DeleteSequenceDialog } from "./DeleteSequenceDialog";

interface SequenceActionsProps {
  sequenceId: string;
  status: string;
  onStatusChange: (newStatus: 'active' | 'paused') => Promise<void>;
  onDelete: () => Promise<void>;
}

export const SequenceActions = ({ 
  sequenceId, 
  status, 
  onStatusChange,
  onDelete 
}: SequenceActionsProps) => {
  const navigate = useNavigate();

  return (
    <div className="space-x-2">
      {status === "active" ? (
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