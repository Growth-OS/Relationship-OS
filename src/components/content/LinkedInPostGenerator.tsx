import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const LinkedInPostGenerator = () => {
  const [topic, setTopic] = useState("");
  const [postFormat, setPostFormat] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");

  // Fetch AI persona settings
  const { data: aiPersona } = useQuery({
    queryKey: ["aiPrompts", "character_profile"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ai_prompts")
        .select("*")
        .eq("category", "character_profile")
        .single();

      if (error) throw error;
      return data;
    },
  });

  const handleGenerate = async () => {
    // TODO: Implement AI generation logic
    console.log("Generating with persona:", aiPersona);
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Post Generator Section */}
      <Card>
        <CardHeader>
          <CardTitle>Post Generator</CardTitle>
          <CardDescription>
            Plan, create, schedule, and optimize your LinkedIn content with our AI writer.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Post Topic</label>
            <Textarea
              placeholder="What would you like to write about?"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Post Format</label>
            <Select value={postFormat} onValueChange={setPostFormat}>
              <SelectTrigger>
                <SelectValue placeholder="Select post format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text Only</SelectItem>
                <SelectItem value="text-image">Text + Image</SelectItem>
                <SelectItem value="carousel">Carousel Post</SelectItem>
                <SelectItem value="poll">Poll</SelectItem>
                <SelectItem value="article">Article</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => {
              setTopic("");
              setPostFormat("");
            }}>
              Clear
            </Button>
            <Button onClick={handleGenerate} className="gap-2">
              <Wand2 className="w-4 h-4" />
              Generate
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Generated Content Section */}
      <Card>
        <CardHeader>
          <CardTitle>Generated Post</CardTitle>
          <CardDescription>
            Your AI-generated LinkedIn content will appear here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {generatedContent ? (
            <div className="prose max-w-none">
              {generatedContent}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              Generated content will appear here
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LinkedInPostGenerator;