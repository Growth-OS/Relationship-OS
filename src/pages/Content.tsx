import LinkedInPostGenerator from "@/components/content/LinkedInPostGenerator";

const Content = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">LinkedIn Content</h1>
        <p className="text-gray-600">Generate engaging LinkedIn content using AI and your personalized settings</p>
      </div>
      
      <LinkedInPostGenerator />
    </div>
  );
};

export default Content;