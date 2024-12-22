import { AIPromptManager } from "@/components/substack/AIPromptManager";

const AIPrompts = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">AI Prompts</h1>
        <p className="text-gray-600">Manage your AI prompt templates</p>
      </div>
      
      <AIPromptManager />
    </div>
  );
};

export default AIPrompts;