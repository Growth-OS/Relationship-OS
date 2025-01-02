import { TableCell, TableRow } from "@/components/ui/table";
import { ProspectActions } from "./ProspectActions";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface ProspectRowProps {
  prospect: {
    id: string;
    company_name: string;
    contact_email?: string;
    contact_job_title?: string;
    contact_linkedin?: string;
    source: 'website' | 'referral' | 'linkedin' | 'cold_outreach' | 'conference' | 'other';
    notes?: string;
    sequence_name?: string;
    sequence_status?: string;
    current_step?: number;
  };
  sourceLabels: Record<string, string>;
  onDelete: (id: string) => Promise<void>;
  onConvertToLead: (prospect: any) => Promise<void>;
  onEdit: (prospect: any) => void;
}

export const ProspectRow = ({ prospect, sourceLabels, onDelete, onConvertToLead, onEdit }: ProspectRowProps) => {
  const getSequenceStatusColor = (status?: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <TableRow className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <TableCell className="font-medium">{prospect.company_name}</TableCell>
      <TableCell>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          {sourceLabels[prospect.source]}
        </span>
      </TableCell>
      <TableCell>{prospect.contact_job_title || '-'}</TableCell>
      <TableCell>{prospect.contact_email || '-'}</TableCell>
      <TableCell>
        {prospect.contact_linkedin ? (
          <a 
            href={prospect.contact_linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-600 hover:text-purple-700 hover:underline"
          >
            View Profile
          </a>
        ) : '-'}
      </TableCell>
      <TableCell>
        {prospect.sequence_name ? (
          <div className="space-y-1">
            <div>{prospect.sequence_name}</div>
            <Badge className={getSequenceStatusColor(prospect.sequence_status)}>
              {prospect.sequence_status || 'Not started'}
            </Badge>
          </div>
        ) : '-'}
      </TableCell>
      <TableCell>
        {prospect.current_step ? (
          <div className="space-y-1">
            <div className="text-sm text-gray-600">Step {prospect.current_step}</div>
            <Progress value={prospect.current_step * 20} className="h-2" />
          </div>
        ) : '-'}
      </TableCell>
      <TableCell className="max-w-[200px] truncate">
        {prospect.notes ? (
          <span title={prospect.notes}>{prospect.notes}</span>
        ) : '-'}
      </TableCell>
      <TableCell>
        <ProspectActions
          prospect={prospect}
          onDelete={onDelete}
          onConvertToLead={onConvertToLead}
          onEdit={onEdit}
        />
      </TableCell>
    </TableRow>
  );
};