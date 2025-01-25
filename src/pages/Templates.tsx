import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, Grid, List } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreateTemplateForm } from "@/components/templates/CreateTemplateForm";
import { toast } from "sonner";

const Templates = () => {
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [open, setOpen] = React.useState(false);

  const { data: templates, isLoading, refetch } = useQuery({
    queryKey: ['templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleSuccess = () => {
    setOpen(false);
    refetch();
    toast.success("Template created successfully");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Templates</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode('grid')}
            className={viewMode === 'grid' ? 'bg-primary text-white' : ''}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode('list')}
            className={viewMode === 'list' ? 'bg-primary text-white' : ''}
          >
            <List className="h-4 w-4" />
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Template
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Template</DialogTitle>
              </DialogHeader>
              <CreateTemplateForm onSuccess={handleSuccess} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
        {templates?.map((template) => (
          <Card key={template.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{template.title}</h3>
                {template.description && (
                  <p className="text-sm text-gray-500 mt-1">{template.description}</p>
                )}
              </div>
              {template.category && (
                <Badge variant="secondary">{template.category}</Badge>
              )}
            </div>
            <div className="mt-4 flex justify-between items-center">
              <span className="text-sm text-gray-500">
                Last used: {template.last_used_at ? new Date(template.last_used_at).toLocaleDateString() : 'Never'}
              </span>
              <Button variant="outline" size="sm">Download</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Templates;