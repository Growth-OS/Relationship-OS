import { CharacterProfileSection } from "@/components/ai-prompts/CharacterProfileSection";
import { CompanyInfoSection } from "@/components/ai-prompts/CompanyInfoSection";
import { WordsToAvoidSection } from "@/components/ai-prompts/WordsToAvoidSection";

const AIPersona = () => {
  return (
    <div className="space-y-8">
      <div className="border-b pb-6">
        <h1 className="text-2xl font-semibold">AI Persona</h1>
        <p className="text-muted-foreground mt-1">Configure your AI persona settings</p>
      </div>
      
      <div className="grid gap-8">
        <CharacterProfileSection />
        <CompanyInfoSection />
        <WordsToAvoidSection />
      </div>
    </div>
  );
};

export default AIPersona;