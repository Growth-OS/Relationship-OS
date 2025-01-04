import { useQueryClient } from "@tanstack/react-query";
import { useProspectDelete } from "./useProspectDelete";
import { useProspectConversion } from "./useProspectConversion";
import { useSequenceAssignment } from "./useSequenceAssignment";

export const useProspectOperations = () => {
  const queryClient = useQueryClient();
  const { handleDelete } = useProspectDelete();
  const { handleConvertToLead } = useProspectConversion();
  const { handleAssignSequence } = useSequenceAssignment();

  const wrappedHandleDelete = async (id: string) => {
    await handleDelete(id);
    await queryClient.invalidateQueries({ queryKey: ['prospects'] });
  };

  const wrappedHandleConvertToLead = async (prospect: any) => {
    await handleConvertToLead(prospect);
    await queryClient.invalidateQueries({ queryKey: ['prospects'] });
    await queryClient.invalidateQueries({ queryKey: ['deals'] });
  };

  const wrappedHandleAssignSequence = async (sequenceId: string, selectedIds: string[]) => {
    const success = await handleAssignSequence(sequenceId, selectedIds);
    if (success) {
      await queryClient.invalidateQueries({ queryKey: ['prospects'] });
      await queryClient.invalidateQueries({ queryKey: ['sequences'] });
      await queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
    return success;
  };

  return {
    handleDelete: wrappedHandleDelete,
    handleConvertToLead: wrappedHandleConvertToLead,
    handleAssignSequence: wrappedHandleAssignSequence
  };
};