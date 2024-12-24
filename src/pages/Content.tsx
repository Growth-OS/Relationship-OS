import { LinkedInPostGenerator } from "@/components/content/LinkedInPostGenerator";

const Content = () => {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">LinkedIn Content</h1>
        <p className="text-muted-foreground">
          Generate engaging LinkedIn content using AI
        </p>
      </div>
      
      <LinkedInPostGenerator />
    </div>
  );
};

export default Content;