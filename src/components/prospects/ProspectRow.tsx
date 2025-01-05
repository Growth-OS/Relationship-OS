import { TableCell, TableRow } from "@/components/ui/table";
import { ProspectActions } from "./ProspectActions";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import type { Prospect } from "./types/prospect";

interface ProspectRowProps {
  prospect: Prospect;
  sourceLabels: Record<string, string>;
  onDelete: (id: string) => Promise<void>;
  onEdit: (prospect: any) => void;
  onConvertToLead: (prospect: Prospect) => Promise<void>;
  isSelected: boolean;
  onSelectChange: (checked: boolean) => void;
}

export const ProspectRow = ({ 
  prospect, 
  sourceLabels, 
  onDelete, 
  onEdit,
  onConvertToLead,
  isSelected,
  onSelectChange
}: ProspectRowProps) => {
  const getSequenceStatusColor = (status?: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const isConverted = prospect.status === 'converted';

  return (
    <TableRow className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
      isConverted ? 'opacity-60' : ''
    }`}>
      <TableCell>
        <Checkbox
          checked={isSelected}
          onCheckedChange={onSelectChange}
          className="mr-2"
          disabled={isConverted}
        />
      </TableCell>
      <TableCell className="font-medium">
        <div className="flex items-center gap-2">
          {prospect.company_name}
          {isConverted && (
            <Badge variant="secondary" className="text-xs">
              Converted to Deal
            </Badge>
          )}
        </div>
      </TableCell>
      <TableCell>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
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
        {!isConverted && (
          <ProspectActions
            prospect={prospect}
            onDelete={onDelete}
            onEdit={onEdit}
            onConvertToLead={onConvertToLead}
          />
        )}
      </TableCell>
    </TableRow>
  );
};