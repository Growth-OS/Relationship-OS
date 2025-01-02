import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const CreateSequenceButton = () => {
  return (
    <Button className="gap-2">
      <Plus className="h-4 w-4" />
      Create Sequence
    </Button>
  );
};