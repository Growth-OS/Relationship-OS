import { GeneralPromptsSection } from "@/components/ai-prompts/GeneralPromptsSection";

const AIPrompts = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">AI Prompts</h1>
        <p className="text-gray-600">Manage your AI prompt templates</p>
      </div>
      
      <div className="grid gap-8">
        <GeneralPromptsSection />
      </div>
    </div>
  );
};

export default AIPrompts;