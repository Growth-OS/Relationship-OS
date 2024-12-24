import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text, Image, Poll, MessageSquare } from "lucide-react";

interface PostFormProps {
  onGenerate: (data: { topic: string; format: string }) => void;
}

export const PostForm = ({ onGenerate }: PostFormProps) => {
  const [topic, setTopic] = useState("");
  const [format, setFormat] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic || !format) return;
    onGenerate({ topic, format });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Post</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Topic</label>
            <Textarea
              placeholder="What would you like to write about?"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Post Format</label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger>
                <SelectValue placeholder="Select post format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">
                  <div className="flex items-center gap-2">
                    <Text className="w-4 h-4" />
                    <span>Text Only</span>
                  </div>
                </SelectItem>
                <SelectItem value="text-image">
                  <div className="flex items-center gap-2">
                    <Image className="w-4 h-4" />
                    <span>Text + Image</span>
                  </div>
                </SelectItem>
                <SelectItem value="poll">
                  <div className="flex items-center gap-2">
                    <Poll className="w-4 h-4" />
                    <span>Poll</span>
                  </div>
                </SelectItem>
                <SelectItem value="carousel">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    <span>Carousel Post</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full">
            Generate Post
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};