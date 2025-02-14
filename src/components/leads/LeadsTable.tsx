import { Table, TableBody } from "@/components/ui/table";
import { useState, useEffect, useCallback } from "react";
import { Lead } from "./types/lead";
import { EditableLead } from "./types/lead";
import { LeadTableHeader } from "./table/LeadTableHeader";
import { LeadRow } from "./table/LeadRow";
import { TablePagination } from "@/components/prospects/components/TablePagination";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface LeadsTableProps {
  leads: Lead[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSearch?: (term: string) => void;
  onFilter?: (filters: { source?: string }) => void;
  isLoading?: boolean;
  selectedIds?: string[];
  onSelectChange?: (ids: string[]) => void;
}

export const LeadsTable = ({
  leads,
  currentPage,
  totalPages,
  onPageChange,
  isLoading,
  selectedIds = [],
  onSelectChange,
}: LeadsTableProps) => {
  const [editableLeads, setEditableLeads] = useState<EditableLead[]>([]);

  // Memoize the conversion of leads to editableLeads
  const convertToEditableLeads = useCallback((leads: Lead[]): EditableLead[] => {
    return leads.map(lead => ({ ...lead, isEditing: false }));
  }, []);

  useEffect(() => {
    setEditableLeads(convertToEditableLeads(leads));
  }, [leads, convertToEditableLeads]);

  // Subscribe to real-time changes
  useEffect(() => {
    console.log('Setting up real-time subscription for leads');
    const channel = supabase
      .channel('leads-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'leads'
        },
        (payload) => {
          console.log('Received real-time update:', payload);
          setEditableLeads(prevLeads => {
            if (payload.eventType === 'DELETE') {
              return prevLeads.filter(lead => lead.id !== payload.old.id);
            } 
            
            if (payload.eventType === 'UPDATE') {
              return prevLeads.map(lead => {
                if (lead.id === payload.new.id) {
                  // Ensure we preserve the isEditing state while updating other fields
                  return {
                    ...(payload.new as Lead),
                    isEditing: lead.isEditing
                  };
                }
                return lead;
              });
            }

            if (payload.eventType === 'INSERT') {
              const newLead = {
                ...(payload.new as Lead),
                isEditing: false
              };
              return [newLead, ...prevLeads];
            }

            return prevLeads;
          });
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    return () => {
      console.log('Cleaning up real-time subscription');
      supabase.removeChannel(channel);
    };
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success("Lead deleted successfully");
    } catch (error) {
      console.error('Error deleting lead:', error);
      toast.error("Failed to delete lead");
    }
  };

  const handleEdit = async (lead: Lead) => {
    try {
      const { isEditing, ...leadData } = lead as EditableLead;
      
      const { error } = await supabase
        .from('leads')
        .update(leadData)
        .eq('id', lead.id);

      if (error) throw error;

      toast.success("Lead updated successfully");
    } catch (error) {
      console.error('Error updating lead:', error);
      toast.error("Failed to update lead");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <Table>
        <LeadTableHeader 
          isAllSelected={selectedIds.length === leads.length}
          onSelectAll={() => onSelectChange?.(selectedIds.length === leads.length ? [] : leads.map(l => l.id))}
        />
        <TableBody>
          {editableLeads.map((lead) => (
            <LeadRow
              key={lead.id}
              lead={lead}
              onDelete={handleDelete}
              onEdit={handleEdit}
              isSelected={selectedIds.includes(lead.id)}
              onSelectChange={(checked) => {
                if (onSelectChange) {
                  onSelectChange(
                    checked 
                      ? [...selectedIds, lead.id]
                      : selectedIds.filter(id => id !== lead.id)
                  );
                }
              }}
            />
          ))}
        </TableBody>
      </Table>

      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};