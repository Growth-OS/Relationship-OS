import { GeneralPromptsSection } from "@/components/ai-prompts/GeneralPromptsSection";

const AIPrompts = () => {
  return (
    <div className="space-y-8">
      <div className="border-b pb-6">
        <h1 className="text-2xl font-semibold text-left">AI Prompts</h1>
        <p className="text-muted-foreground text-left mt-1">Manage your AI prompt templates</p>
      </div>
      
      <div className="grid gap-8">
        <GeneralPromptsSection />
      </div>
    </div>
  );
};

export default AIPrompts;