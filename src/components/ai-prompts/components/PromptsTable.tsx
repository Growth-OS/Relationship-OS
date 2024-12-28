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
    <div className="rounded-lg border border-muted bg-background">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-xs font-medium text-muted-foreground">Name</TableHead>
            <TableHead className="text-xs font-medium text-muted-foreground">Prompt</TableHead>
            <TableHead className="w-[100px] text-xs font-medium text-muted-foreground">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-sm text-muted-foreground">
                Loading prompts...
              </TableCell>
            </TableRow>
          ) : prompts && prompts.length > 0 ? (
            prompts.map((prompt) => (
              <TableRow key={prompt.id}>
                <TableCell className="text-sm">{prompt.title}</TableCell>
                <TableCell className="max-w-[400px] truncate text-sm text-muted-foreground">
                  {prompt.system_prompt}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(prompt.id)}
                    disabled={isDeleting}
                    className="h-8 w-8"
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-sm text-muted-foreground">
                No prompts found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};