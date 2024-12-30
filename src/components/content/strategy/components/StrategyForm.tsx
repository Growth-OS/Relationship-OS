import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface StrategyFormProps {
  strategy: {
    title: string;
    description: string | null;
    target_audience: string | null;
    key_topics: string[];
    content_pillars: string[];
  };
  onChange: (field: string, value: any) => void;
}

export const StrategyForm = ({ strategy, onChange }: StrategyFormProps) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="font-medium mb-1 block">Title</label>
        <Input
          value={strategy.title || ""}
          onChange={(e) => onChange("title", e.target.value)}
          placeholder="Enter strategy title"
        />
      </div>
      <div>
        <label className="font-medium mb-1 block">Description</label>
        <Textarea
          value={strategy.description || ""}
          onChange={(e) => onChange("description", e.target.value)}
          placeholder="Describe your content strategy"
        />
      </div>
      <div>
        <label className="font-medium mb-1 block">Target Audience</label>
        <Textarea
          value={strategy.target_audience || ""}
          onChange={(e) => onChange("target_audience", e.target.value)}
          placeholder="Describe your target audience"
        />
      </div>
      <div>
        <label className="font-medium mb-1 block">Key Topics</label>
        <Input
          value={strategy.key_topics?.join(", ") || ""}
          onChange={(e) =>
            onChange(
              "key_topics",
              e.target.value.split(",").map((t) => t.trim())
            )
          }
          placeholder="Enter topics separated by commas"
        />
      </div>
      <div>
        <label className="font-medium mb-1 block">Content Pillars</label>
        <Input
          value={strategy.content_pillars?.join(", ") || ""}
          onChange={(e) =>
            onChange(
              "content_pillars",
              e.target.value.split(",").map((t) => t.trim())
            )
          }
          placeholder="Enter content pillars separated by commas"
        />
      </div>
    </div>
  );
};