import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Prospect } from "../types/prospect";

interface ProspectRowProps {
  prospect: Prospect;
  isSelected: boolean;
  onSelectChange: (checked: boolean) => void;
  onEdit: (prospect: Prospect) => void;
  onDelete: (id: string) => void;
  onConvertToLead: (prospect: Prospect) => Promise<void>;
  sourceLabels: Record<string, string>;
}

export const ProspectRow = ({
  prospect,
  isSelected,
  onSelectChange,
  onEdit,
  onDelete,
  onConvertToLead,
  sourceLabels,
}: ProspectRowProps) => {
  return (
    <tr key={prospect.id} className="hover:bg-muted/50">
      <td className="p-4">
        <Checkbox
          checked={isSelected}
          onCheckedChange={onSelectChange}
        />
      </td>
      <td className="p-4 font-medium">{prospect.company_name}</td>
      <td className="p-4 text-muted-foreground">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          {sourceLabels[prospect.source]}
        </span>
      </td>
      <td className="p-4 text-muted-foreground">{prospect.contact_job_title}</td>
      <td className="p-4 text-muted-foreground">{prospect.contact_email}</td>
      <td className="p-4 text-muted-foreground">
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
      </td>
      <td className="p-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(prospect)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(prospect.id)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </td>
    </tr>
  );
};