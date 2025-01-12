import { Search, SlidersHorizontal, Check, X, Edit2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Prospect, EditableProspect } from "@/types/prospects";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ProspectsTableProps {
  prospects: Prospect[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showConverted?: boolean;
  onShowConvertedChange?: (show: boolean) => void;
  onSearch?: (term: string) => void;
  onFilter?: (filters: { source?: string }) => void;
  onUpdate?: (id: string, data: Partial<Prospect>) => Promise<void>;
  isLoading?: boolean;
}

export const ProspectsTable = ({
  prospects,
  currentPage,
  totalPages,
  onPageChange,
  showConverted,
  onShowConvertedChange,
  onSearch,
  onFilter,
  onUpdate,
  isLoading,
}: ProspectsTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [editableProspects, setEditableProspects] = useState<EditableProspect[]>([]);
  const [editValues, setEditValues] = useState<Record<string, Partial<Prospect>>>({});

  useEffect(() => {
    setEditableProspects(prospects.map(p => ({ ...p, isEditing: false })));
  }, [prospects]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      onSearch?.(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  const sourceLabels: Record<string, string> = {
    linkedin: "LinkedIn",
    referral: "Referral",
    website: "Website",
    cold_outreach: "Cold Outreach",
    conference: "Conference",
    accelerator: "Accelerator",
    other: "Other"
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSourceFilterChange = (value: string) => {
    setSourceFilter(value);
    onFilter?.({ source: value === "all" ? undefined : value });
  };

  const startEditing = (prospect: Prospect) => {
    setEditableProspects(prev => 
      prev.map(p => ({
        ...p,
        isEditing: p.id === prospect.id
      }))
    );
    setEditValues(prev => ({
      ...prev,
      [prospect.id]: { ...prospect }
    }));
  };

  const cancelEditing = (prospectId: string) => {
    setEditableProspects(prev =>
      prev.map(p => ({
        ...p,
        isEditing: p.id === prospectId ? false : p.isEditing
      }))
    );
    setEditValues(prev => {
      const newValues = { ...prev };
      delete newValues[prospectId];
      return newValues;
    });
  };

  const handleInputChange = (
    prospectId: string,
    field: keyof Prospect,
    value: string
  ) => {
    setEditValues(prev => ({
      ...prev,
      [prospectId]: {
        ...prev[prospectId],
        [field]: value
      }
    }));
  };

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const saveChanges = async (prospectId: string) => {
    const changes = editValues[prospectId];
    
    // Validation
    if (changes.contact_email && !validateEmail(changes.contact_email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (changes.company_website && !validateUrl(changes.company_website)) {
      toast.error("Please enter a valid website URL");
      return;
    }

    try {
      // Optimistic update
      setEditableProspects(prev =>
        prev.map(p => {
          if (p.id === prospectId) {
            return {
              ...p,
              ...changes,
              isEditing: false
            };
          }
          return p;
        })
      );

      await onUpdate?.(prospectId, changes);
      toast.success("Changes saved successfully");
    } catch (error) {
      // Revert on error
      setEditableProspects(prev =>
        prev.map(p => {
          if (p.id === prospectId) {
            return {
              ...prospects.find(original => original.id === prospectId)!,
              isEditing: false
            };
          }
          return p;
        })
      );
      toast.error("Failed to save changes");
    }

    cancelEditing(prospectId);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search prospects..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-9 w-[300px]"
            />
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-gray-500" />
            <Select value={sourceFilter} onValueChange={handleSourceFilterChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All sources</SelectItem>
                {Object.entries(sourceLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Source
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {editableProspects.map((prospect) => (
              <tr key={prospect.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {prospect.isEditing ? (
                    <div className="space-y-2">
                      <Input
                        value={editValues[prospect.id]?.contact_email || prospect.contact_email || ''}
                        onChange={(e) => handleInputChange(prospect.id, 'contact_email', e.target.value)}
                        placeholder="Email"
                        className="w-full"
                      />
                    </div>
                  ) : (
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {prospect.contact_email}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {prospect.isEditing ? (
                    <div className="space-y-2">
                      <Input
                        value={editValues[prospect.id]?.company_name || prospect.company_name}
                        onChange={(e) => handleInputChange(prospect.id, 'company_name', e.target.value)}
                        placeholder="Company name"
                        className="w-full"
                      />
                      <Input
                        value={editValues[prospect.id]?.company_website || prospect.company_website || ''}
                        onChange={(e) => handleInputChange(prospect.id, 'company_website', e.target.value)}
                        placeholder="Website"
                        className="w-full"
                      />
                    </div>
                  ) : (
                    <>
                      <div className="text-sm text-gray-900 dark:text-white">
                        {prospect.company_name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {prospect.company_website}
                      </div>
                    </>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {prospect.isEditing ? (
                    <Select
                      value={editValues[prospect.id]?.source || prospect.source}
                      onValueChange={(value) => handleInputChange(prospect.id, 'source', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(sourceLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {sourceLabels[prospect.source] || prospect.source}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    prospect.status === 'converted'
                      ? 'bg-green-100 text-green-800'
                      : prospect.status === 'active'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {prospect.status?.charAt(0).toUpperCase() + prospect.status?.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {prospect.isEditing ? (
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => saveChanges(prospect.id)}
                      >
                        <Check className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => cancelEditing(prospect.id)}
                      >
                        <X className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => startEditing(prospect)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};