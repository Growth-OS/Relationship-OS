import { Input } from "@/components/ui/input";
import { TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface EditableCellProps {
  isEditing: boolean;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "url" | "select";
  options?: { value: string; label: string }[];
}

export const EditableCell = ({ 
  isEditing, 
  value, 
  onChange, 
  type = "text", 
  options 
}: EditableCellProps) => {
  if (!isEditing) {
    return <TableCell className="p-4 text-left">{value}</TableCell>;
  }

  if (type === "select" && options) {
    return (
      <TableCell className="p-4 text-left">
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>
    );
  }

  return (
    <TableCell className="p-4 text-left">
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full"
      />
    </TableCell>
  );
};