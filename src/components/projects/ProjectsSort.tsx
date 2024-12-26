import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProjectsSortProps {
  value: string;
  onChange: (value: string) => void;
}

export const ProjectsSort = ({ value, onChange }: ProjectsSortProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="last_activity">Last Activity</SelectItem>
        <SelectItem value="name">Project Name</SelectItem>
        <SelectItem value="client">Client Name</SelectItem>
        <SelectItem value="start_date">Start Date</SelectItem>
        <SelectItem value="budget">Budget</SelectItem>
      </SelectContent>
    </Select>
  );
};