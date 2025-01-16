import { LeadContactInfoProps } from "../../types/lead";

export const LeadContactInfo = ({ lead }: LeadContactInfoProps) => {
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