import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { LeadRowProps } from "../types/lead";
import { Edit, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const LeadRow = ({
  lead,
  sourceLabels,
  onDelete,
  onEdit,
  isSelected,
  onSelectChange,
}: LeadRowProps) => {
  return (
    <TableRow>
      <TableCell>
        <Checkbox
          checked={isSelected}
          onCheckedChange={onSelectChange}
        />
      </TableCell>
      <TableCell>
        <div>
          <p className="font-medium">{lead.company_name}</p>
          {lead.company_website && (
            <a
              href={lead.company_website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:underline"
            >
              {lead.company_website}
            </a>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div>
          {lead.first_name && (
            <p className="font-medium">{lead.first_name}</p>
          )}
          {lead.contact_email && (
            <p className="text-sm text-muted-foreground">{lead.contact_email}</p>
          )}
          {lead.contact_job_title && (
            <p className="text-sm text-muted-foreground">{lead.contact_job_title}</p>
          )}
        </div>
      </TableCell>
      <TableCell>
        {sourceLabels[lead.source] || lead.source}
      </TableCell>
      <TableCell>
        <span className="capitalize">{lead.status}</span>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(lead)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Lead</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this lead? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(lead.id)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </TableCell>
    </TableRow>
  );
};