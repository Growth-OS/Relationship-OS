import { Input } from "@/components/ui/input";
import { LeadCompanyInfoProps } from "../../types/lead";

export const LeadCompanyInfo = ({
  lead,
  isEditing,
  editedLead,
  onEditChange,
}: LeadCompanyInfoProps) => {
  if (isEditing) {
    return (
      <div className="space-y-2">
        <Input
          value={editedLead.company_name}
          onChange={(e) => onEditChange('company_name', e.target.value)}
          className="w-full"
        />
        <Input
          value={editedLead.company_website || ''}
          onChange={(e) => onEditChange('company_website', e.target.value)}
          placeholder="Website"
          className="w-full"
        />
      </div>
    );
  }

  return (
    <>
      <p className="font-medium">{lead.company_name}</p>
      {lead.company_website && (
        <a
          href={lead.company_website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-600 hover:text-purple-700 hover:underline"
        >
          Visit Website
        </a>
      )}
    </>
  );
};