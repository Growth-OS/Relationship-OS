import { useState } from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wand2, X } from "lucide-react";

interface PostFormProps {
  onGenerate: (data: { topic: string; format: string }) => void;
}

export const PostForm = ({ onGenerate }: PostFormProps) => {
  const [topic, setTopic] = useState("");
  const [postFormat, setPostFormat] = useState("");

  const handleSubmit = () => {
    onGenerate({ topic, format: postFormat });
  };

  const handleClear = () => {
    setTopic("");
    setPostFormat("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Post Generator</CardTitle>
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
          <Button variant="outline" onClick={handleClear} className="gap-2">
            <X className="w-4 h-4" />
            Clear
          </Button>
          <Button onClick={handleSubmit} className="gap-2">
            <Wand2 className="w-4 h-4" />
            Generate
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};