import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Prospect } from "@/types/prospects";
import { useState } from "react";
import { AssignSequenceDialog } from "@/components/prospects/components/AssignSequenceDialog";
import { useSequenceAssignment } from "@/components/prospects/hooks/useSequenceAssignment";
import { toast } from "sonner";

interface ProjectsListProps {
  projects: Prospect[];
  isLoading: boolean;
  filters: Array<{ field: string; value: string }>;
}

export const ProjectsList = ({ projects, isLoading, filters }: ProjectsListProps) => {
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedProspectId, setSelectedProspectId] = useState<string | null>(null);
  const { handleAssignSequence } = useSequenceAssignment();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  const filteredProjects = projects.filter(project => {
    return filters.every(filter => {
      const value = project[filter.field as keyof Prospect];
      if (!value) return false;
      return String(value).toLowerCase().includes(filter.value.toLowerCase());
    });
  });

  if (filteredProjects.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No prospects found matching the current filters
      </div>
    );
  }

  const handleConvertToSequence = async (prospectId: string) => {
    setSelectedProspectId(prospectId);
    setIsAssignDialogOpen(true);
  };

  const handleAssignToSequence = async (sequenceId: string) => {
    if (!selectedProspectId) return;
    
    try {
      await handleAssignSequence(sequenceId, [selectedProspectId]);
      toast.success("Prospect assigned to sequence successfully");
      setIsAssignDialogOpen(false);
    } catch (error) {
      console.error("Error assigning prospect to sequence:", error);
      toast.error("Failed to assign prospect to sequence");
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Company Name</TableHead>
            <TableHead className="text-left">Email</TableHead>
            <TableHead className="text-left">First Name</TableHead>
            <TableHead className="text-left">Website</TableHead>
            <TableHead className="text-left">Accelerator Program</TableHead>
            <TableHead className="text-left">Status</TableHead>
            <TableHead className="text-left">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProjects.map((project) => (
            <TableRow key={project.id} className="hover:bg-muted/50">
              <TableCell className="text-left font-medium">{project.company_name}</TableCell>
              <TableCell className="text-left">{project.contact_email}</TableCell>
              <TableCell className="text-left">{project.first_name}</TableCell>
              <TableCell className="text-left">
                {project.company_website && (
                  <a 
                    href={project.company_website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {project.company_website}
                  </a>
                )}
              </TableCell>
              <TableCell className="text-left">{project.training_event}</TableCell>
              <TableCell className="text-left">{project.status}</TableCell>
              <TableCell className="text-left">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => handleConvertToSequence(project.id)}
                >
                  Convert to Sequence
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AssignSequenceDialog
        open={isAssignDialogOpen}
        onOpenChange={setIsAssignDialogOpen}
        selectedProspects={selectedProspectId ? [selectedProspectId] : []}
        onAssign={handleAssignToSequence}
        onSuccess={() => setIsAssignDialogOpen(false)}
      />
    </>
  );
};