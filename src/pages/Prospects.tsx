import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { ProjectsList } from "@/components/projects/ProjectsList";
import { ProjectsSearch } from "@/components/projects/ProjectsSearch";
import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreateProspectForm } from "@/components/prospects/form/CreateProspectForm";
import { CSVUploadDialog } from "@/components/prospects/CSVUploadDialog";

const Prospects = () => {
  const [filters, setFilters] = useState<Array<{ field: string; value: string }>>([]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  const { data: prospects, isLoading } = useQuery({
    queryKey: ['prospects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prospects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  const acceleratorOptions = useMemo(() => {
    if (!prospects) return [];
    const uniquePrograms = new Set(
      prospects
        .map(p => p.training_event)
        .filter(Boolean)
    );
    return Array.from(uniquePrograms);
  }, [prospects]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Prospects</h1>
          <div className="flex gap-4">
            <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Upload className="h-4 w-4" />
                  Import CSV
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Upload Prospects CSV</DialogTitle>
                </DialogHeader>
                <CSVUploadDialog onSuccess={() => setUploadDialogOpen(false)} />
              </DialogContent>
            </Dialog>

            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Prospect
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add New Prospect</DialogTitle>
                </DialogHeader>
                <CreateProspectForm onSuccess={() => setCreateDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <ProjectsSearch
          filters={filters}
          onFilterChange={setFilters}
          acceleratorOptions={acceleratorOptions}
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <ProjectsList
          projects={prospects || []}
          isLoading={isLoading}
          filters={filters}
        />
      </div>
    </div>
  );
};

export default Prospects;