import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartBarIcon, Users, DollarSign, NewspaperIcon, Wallet, ListChecks } from "lucide-react";

interface ModuleFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export const ModuleFilter = ({ value, onChange }: ModuleFilterProps) => {
  const modules = [
    { value: 'all', label: 'All Dashboards', icon: ChartBarIcon },
    { value: 'prospects', label: 'Lead Pipeline', icon: Users },
    { value: 'deals', label: 'Client Projects', icon: DollarSign },
    { value: 'sequences', label: 'Sequences', icon: ListChecks },
    { value: 'affiliate', label: 'Affiliate Revenue', icon: NewspaperIcon },
    { value: 'finances', label: 'Finances', icon: Wallet },
  ];

  return (
    <Select value={value} onValueChange={onChange}>
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