import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { CreateProjectForm } from "./CreateProjectForm";

interface ProjectsHeaderProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const ProjectsHeader = ({ open, setOpen }: ProjectsHeaderProps) => {
  return (
    <div className="relative overflow-hidden rounded-lg bg-[#161e2c] border border-gray-800/40 shadow-sm">
      <div className="relative z-10 px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="text-left">
            <h1 className="text-2xl font-medium text-white">
              Projects
            </h1>
            <p className="text-sm text-gray-300 mt-1">
              Manage your client projects and deliverables
            </p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-white hover:bg-white/90 text-black transition-colors shadow-sm hover:shadow-md"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
              </DialogHeader>
              <CreateProjectForm onSuccess={() => setOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};