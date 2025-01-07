import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProjectStatus } from "@/integrations/supabase/types/projects";

interface ProjectsFilterProps {
  value: "all" | ProjectStatus;
  onChange: (value: "all" | ProjectStatus) => void;
}

export const ProjectsFilter = ({ value, onChange }: ProjectsFilterProps) => {
  return (
    <div className="w-[180px]">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-background">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Projects</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="on_hold">On Hold</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};