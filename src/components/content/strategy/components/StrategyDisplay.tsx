interface StrategyDisplayProps {
  strategy: {
    title: string;
    description: string | null;
    target_audience: string | null;
    key_topics: string[];
    content_pillars: string[];
  };
}

export const StrategyDisplay = ({ strategy }: StrategyDisplayProps) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium mb-1">Title</h3>
        <p>{strategy.title}</p>
      </div>
      <div>
        <h3 className="font-medium mb-1">Description</h3>
        <p>{strategy.description}</p>
      </div>
      <div>
        <h3 className="font-medium mb-1">Target Audience</h3>
        <p>{strategy.target_audience}</p>
      </div>
      <div>
        <h3 className="font-medium mb-1">Key Topics</h3>
        <div className="flex flex-wrap gap-2">
          {strategy.key_topics?.map((topic, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
            >
              {topic}
            </span>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-medium mb-1">Content Pillars</h3>
        <div className="flex flex-wrap gap-2">
          {strategy.content_pillars?.map((pillar, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
            >
              {pillar}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};