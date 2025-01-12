import { useQueryClient } from "@tanstack/react-query";
import { useProspectDelete } from "./useProspectDelete";
import { useProspectConversion } from "./useProspectConversion";

export const useProspectOperations = () => {
  const queryClient = useQueryClient();
  const { deleteProspect } = useProspectDelete();
  const { handleConvertToLead } = useProspectConversion();

  const wrappedHandleDelete = async (id: string) => {
    await deleteProspect(id);
    await queryClient.invalidateQueries({ queryKey: ['prospects'] });
  };

  const wrappedHandleConvertToLead = async (prospect: any) => {
    await handleConvertToLead(prospect);
    await queryClient.invalidateQueries({ queryKey: ['prospects'] });
    await queryClient.invalidateQueries({ queryKey: ['deals'] });
  };

  return {
    handleDelete: wrappedHandleDelete,
    handleConvertToLead: wrappedHandleConvertToLead
  };
};