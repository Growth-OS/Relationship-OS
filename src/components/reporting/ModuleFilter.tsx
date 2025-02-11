import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartBarIcon, Users, DollarSign, FolderIcon, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ModuleFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export const ModuleFilter = ({ value, onChange }: ModuleFilterProps) => {
  const navigate = useNavigate();

  const modules = [
    { value: 'all', label: 'All Dashboards', icon: ChartBarIcon },
    { value: 'prospects', label: 'Lead Pipeline', icon: Users },
    { value: 'deals', label: 'Client Projects', icon: DollarSign },
    { value: 'files', label: 'Project Files', icon: FolderIcon },
    { value: 'finances', label: 'Finances', icon: Wallet },
  ];

  const handleValueChange = (newValue: string) => {
    if (newValue === 'files') {
      // Navigate to the files section of the current project
      const currentPath = window.location.pathname;
      const projectId = currentPath.split('/').pop();
      if (projectId) {
        navigate(`/dashboard/projects/${projectId}?tab=files`);
      }
    } else {
      onChange(newValue);
    }
  };

  return (
    <Select value={value} onValueChange={handleValueChange}>
      <SelectTrigger className="w-[200px] bg-white dark:bg-gray-800">
        <SelectValue placeholder="Filter by revenue stream" />
      </SelectTrigger>
      <SelectContent>
        {modules.map(({ value, label, icon: Icon }) => (
          <SelectItem key={value} value={value} className="cursor-pointer">
            <div className="flex items-center gap-2">
              <Icon className="w-4 h-4 text-muted-foreground" />
              <span>{label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};