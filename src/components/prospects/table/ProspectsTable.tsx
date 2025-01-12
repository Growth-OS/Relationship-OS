import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TableLoadingState } from "../components/TableLoadingState";
import { TableEmptyState } from "../components/TableEmptyState";
import { TablePagination } from "../components/TablePagination";
import { ProspectRow } from "./ProspectRow";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const ITEMS_PER_PAGE = 10;

interface ProspectsTableProps {
  onEdit: (prospect: any) => void;
  onDelete: (id: string) => Promise<void>;
  onConvertToLead: (prospect: any) => Promise<void>;
}

export const ProspectsTable = ({ onEdit, onDelete, onConvertToLead }: ProspectsTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showConverted, setShowConverted] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['prospects', currentPage, showConverted],
    queryFn: async () => {
      console.log('Fetching prospects for page:', currentPage, 'showConverted:', showConverted);
      
      const countQuery = supabase
        .from('prospect_sequence_info')
        .select('*', { count: 'exact', head: true });

      if (showConverted) {
        countQuery.eq('status', 'converted');
      } else {
        countQuery.neq('status', 'converted');
      }

      const { count, error: countError } = await countQuery;
      
      if (countError) {
        console.error('Error fetching count:', countError);
        throw countError;
      }

      const dataQuery = supabase
        .from('prospect_sequence_info')
        .select('*')
        .order('created_at', { ascending: false });

      if (showConverted) {
        dataQuery.eq('status', 'converted');
      } else {
        dataQuery.neq('status', 'converted');
      }

      const { data: prospectsData, error: dataError } = await dataQuery
        .range((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE - 1);
      
      if (dataError) {
        console.error('Error fetching prospects:', dataError);
        throw dataError;
      }
      
      return {
        prospects: prospectsData || [],
        totalCount: count || 0,
      };
    },
    staleTime: 5000,
  });

  const totalPages = Math.ceil((data?.totalCount || 0) / ITEMS_PER_PAGE);

  if (isLoading) return <TableLoadingState />;
  if (!data?.prospects.length) return <TableEmptyState />;

  const sourceLabels: Record<string, string> = {
    website: 'Website',
    referral: 'Referral',
    linkedin: 'LinkedIn',
    cold_outreach: 'Cold Outreach',
    conference: 'Conference',
    accelerator: 'Accelerator',
    other: 'Other'
  };

  return (
    <>
      <div className="flex justify-end items-center mb-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="show-converted"
            checked={showConverted}
            onCheckedChange={setShowConverted}
          />
          <Label htmlFor="show-converted">Show converted prospects</Label>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Job Title</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Links</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.prospects.map((prospect) => (
              <ProspectRow
                key={prospect.id}
                prospect={prospect}
                sourceLabels={sourceLabels}
                onDelete={onDelete}
                onEdit={onEdit}
                onConvertToLead={onConvertToLead}
              />
            ))}
          </TableBody>
        </Table>
      </div>
      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </>
  );
};