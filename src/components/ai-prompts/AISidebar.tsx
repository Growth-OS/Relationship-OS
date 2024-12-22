import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { AIPromptManager } from "../substack/AIPromptManager";
import { Button } from "../ui/button";
import { PanelRightClose } from "lucide-react";

interface AISidebarProps {
  open: boolean;
  onClose: () => void;
}

export function AISidebar({ open, onClose }: AISidebarProps) {
  if (!open) return null;

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar side="right" variant="floating">
        <div className="h-screen w-80 bg-background border-l">
          <SidebarHeader className="border-b">
            <div className="flex items-center justify-between p-4">
              <h2 className="font-semibold">AI Prompts</h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <PanelRightClose className="h-4 w-4" />
              </Button>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <div className="p-4">
              <AIPromptManager />
            </div>
          </SidebarContent>
        </div>
      </Sidebar>
    </SidebarProvider>
  );
}