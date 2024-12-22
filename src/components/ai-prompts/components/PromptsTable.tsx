import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AIPrompt } from "../types";

interface PromptsTableProps {
  prompts: AIPrompt[];
  isLoading: boolean;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export const PromptsTable = ({ prompts, isLoading, onDelete, isDeleting }: PromptsTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Prompt</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                Loading prompts...
              </TableCell>
            </TableRow>
          ) : prompts && prompts.length > 0 ? (
            prompts.map((prompt) => (
              <TableRow key={prompt.id}>
                <TableCell className="font-medium">{prompt.title}</TableCell>
                <TableCell className="max-w-[400px] truncate">
                  {prompt.system_prompt}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(prompt.id)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                No prompts found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};