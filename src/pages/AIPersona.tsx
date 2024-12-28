import { CharacterProfileSection } from "@/components/ai-prompts/CharacterProfileSection";
import { CompanyInfoSection } from "@/components/ai-prompts/CompanyInfoSection";
import { WordsToAvoidSection } from "@/components/ai-prompts/WordsToAvoidSection";

const AIPersona = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-left mb-2">AI Persona</h1>
        <p className="text-gray-600 text-left">Configure your AI persona settings</p>
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