import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  Users, ChartBar, FileText, Briefcase, ListChecks, 
  Calendar, Euro, FileSpreadsheet, LayoutDashboard,
  BookOpen, Plane, Bug
} from "lucide-react";

const modules = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'prospects', label: 'Prospects', icon: Users },
  { id: 'deals', label: 'Deals', icon: Briefcase },
  { id: 'sequences', label: 'Sequences', icon: ListChecks },
  { id: 'tasks', label: 'Tasks', icon: ListChecks },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'affiliates', label: 'Affiliates', icon: Users },
  { id: 'finances', label: 'Finances', icon: Euro },
  { id: 'invoices', label: 'Invoices', icon: FileSpreadsheet },
  { id: 'reporting', label: 'Reporting', icon: ChartBar },
  { id: 'development', label: 'Development', icon: Bug },
  { id: 'substack', label: 'Substack', icon: BookOpen },
  { id: 'travels', label: 'Travels', icon: Plane }
] as const;

interface ModulePermissionsSelectProps {
  selectedModules: string[];
  onModuleToggle: (moduleId: string) => void;
}

export const ModulePermissionsSelect = ({
  selectedModules,
  onModuleToggle,
}: ModulePermissionsSelectProps) => {
  return (
    <div className="space-y-4">
      <Label>Module Access</Label>
      <div className="grid grid-cols-2 gap-4">
        {modules.map(({ id, label, icon: Icon }) => (
          <div key={id} className="flex items-center space-x-2">
            <Checkbox
              id={`module-${id}`}
              checked={selectedModules.includes(id)}
              onCheckedChange={() => onModuleToggle(id)}
            />
            <Label
              htmlFor={`module-${id}`}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <Icon className="h-4 w-4 text-muted-foreground" />
              <span>{label}</span>
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};