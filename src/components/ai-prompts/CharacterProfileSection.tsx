import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export const CharacterProfileSection = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-left">Character Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-left font-semibold">Character Name</h3>
          <Input placeholder="Enter character name" />
        </div>

        <div className="space-y-2">
          <h3 className="text-left font-semibold">Background</h3>
          <Textarea 
            placeholder="Enter character background"
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-left font-semibold">Personality Traits</h3>
          <Textarea 
            placeholder="Enter personality traits"
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-left font-semibold">Tone of Voice</h3>
          <Textarea 
            placeholder="Enter tone of voice"
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-left font-semibold">Areas of Expertise</h3>
          <Textarea 
            placeholder="Enter areas of expertise"
            className="min-h-[100px]"
          />
        </div>
      </CardContent>
    </Card>
  );
};