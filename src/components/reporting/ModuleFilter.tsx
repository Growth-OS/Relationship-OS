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
          <SelectValue placeholder="Filter by module" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Modules</SelectItem>
          <SelectItem value="prospects">Prospects</SelectItem>
          <SelectItem value="deals">Deals</SelectItem>
          <SelectItem value="affiliate">Affiliate Income</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};