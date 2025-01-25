import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, Grid, List, Download, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreateTemplateForm } from "@/components/templates/CreateTemplateForm";
import { toast } from "sonner";
import { format } from "date-fns";

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
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-2xl font-bold">Templates</CardTitle>
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
        </CardHeader>
      </Card>

      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
        {templates?.map((template) => (
          <Card key={template.id} className="group hover:shadow-md transition-all duration-200">
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-1.5">
                  <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100">
                    {template.title}
                  </h3>
                  {template.description && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                      {template.description}
                    </p>
                  )}
                </div>
                {template.category && (
                  <Badge variant="secondary" className="ml-2 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    {template.category}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {template.last_used_at 
                      ? `Last used ${format(new Date(template.last_used_at), 'dd MMM yyyy')}`
                      : 'Never used'}
                  </span>
                </div>
                <Button variant="outline" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Templates;