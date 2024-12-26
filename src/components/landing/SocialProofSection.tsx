export const SocialProofSection = () => {
  return (
    <section className="py-16 bg-black border-y border-white/10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 items-center max-w-4xl mx-auto">
          {companies.map((company, index) => (
            <div 
              key={index}
              className="flex items-center justify-center"
            >
              <div className="text-lg font-medium text-gray-500 hover:text-gray-400 transition-colors">
                {company}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const companies = [
  "TechCorp",
  "GrowthLabs",
  "ScaleUp",
  "NextGen",
  "FutureFlow",
  "ProScale"
];