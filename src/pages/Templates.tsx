import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, Grid, List, ExternalLink, Calendar, Tag } from "lucide-react";
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

  const handleOpenDoc = async (template: any) => {
    try {
      // Update last_used_at timestamp
      const { error: updateError } = await supabase
        .from('project_templates')
        .update({ last_used_at: new Date().toISOString() })
        .eq('id', template.id);

      if (updateError) {
        console.error('Error updating last_used_at:', updateError);
      }

      // Open Google Docs URL in new tab
      window.open(template.google_docs_url, '_blank');
    } catch (error) {
      console.error('Error opening template:', error);
      toast.error("Failed to open template");
    }
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

      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
        {templates?.map((template) => (
          <Card 
            key={template.id} 
            className="group hover:shadow-lg transition-all duration-200 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
          >
            <CardContent className="p-6">
              <div className="flex flex-col space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                      {template.title}
                    </h3>
                    {template.description && (
                      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                        {template.description}
                      </p>
                    )}
                  </div>
                  {template.category && (
                    <div className="ml-4 flex-shrink-0">
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        {template.category}
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                    <Calendar className="h-4 w-4 mr-2 opacity-70" />
                    <span>
                      {template.last_used_at 
                        ? format(new Date(template.last_used_at), 'dd MMM yyyy')
                        : 'Never used'}
                    </span>
                  </div>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    onClick={() => handleOpenDoc(template)}
                  >
                    <ExternalLink className="h-4 w-4 mr-1.5" />
                    Open Doc
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Templates;