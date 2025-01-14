import { Input } from "@/components/ui/input";
import { LeadContactInfoProps } from "../../types/lead";

export const LeadContactInfo = ({
  lead,
  isEditing,
  editedLead,
  onEditChange,
}: LeadContactInfoProps) => {
  if (isEditing) {
    return (
      <div className="space-y-2">
        <Input
          value={editedLead.first_name || ''}
          onChange={(e) => onEditChange('first_name', e.target.value)}
          placeholder="First Name"
          className="w-full"
        />
        <Input
          value={editedLead.contact_email || ''}
          onChange={(e) => onEditChange('contact_email', e.target.value)}
          placeholder="Email"
          className="w-full"
        />
        <Input
          value={editedLead.contact_job_title || ''}
          onChange={(e) => onEditChange('contact_job_title', e.target.value)}
          placeholder="Job Title"
          className="w-full"
        />
      </div>
    );
  }

  return (
    <>
      {lead.first_name && (
        <p className="font-medium">{lead.first_name}</p>
      )}
      {lead.contact_email && (
        <p className="text-sm text-muted-foreground">{lead.contact_email}</p>
      )}
      {lead.contact_job_title && (
        <p className="text-sm text-muted-foreground">{lead.contact_job_title}</p>
      )}
    </>
  );
};