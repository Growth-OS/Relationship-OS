import { DragDropContext } from "@hello-pangea/dnd";
import { Deal } from "@/integrations/supabase/types/deals";
import { DealStageColumn } from "./DealStageColumn";
import { stages } from "./form-fields/StageSelect";
import { useDealDragAndDrop } from "./hooks/useDealDragAndDrop";

interface DealBoardProps {
  deals: Deal[];
  onEdit: (deal: Deal) => void;
}

export const DealBoard = ({ deals, onEdit }: DealBoardProps) => {
  const { handleDragEnd } = useDealDragAndDrop();

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid auto-cols-[320px] grid-flow-col gap-3 overflow-x-auto pb-4 px-4">
        {stages.map((stage) => (
          <DealStageColumn
            key={stage.id}
            stage={stage}
            deals={deals}
            onEdit={onEdit}
          />
        ))}
      </div>
    </DragDropContext>
  );
};