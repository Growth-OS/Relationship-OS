import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ProjectsSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export const ProjectsSearch = ({ value, onChange }: ProjectsSearchProps) => {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
      <Input
        placeholder="Search projects..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9"
      />
    </div>
  );
};