import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ModuleFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export const ModuleFilter = ({ value, onChange }: ModuleFilterProps) => {
  return (
    <div className="w-[200px]">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Filter by revenue stream" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Dashboards</SelectItem>
          <SelectItem value="prospects">Lead Pipeline</SelectItem>
          <SelectItem value="deals">Client Projects</SelectItem>
          <SelectItem value="affiliate">Affiliate Revenue</SelectItem>
          <SelectItem value="substack">Newsletter</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};