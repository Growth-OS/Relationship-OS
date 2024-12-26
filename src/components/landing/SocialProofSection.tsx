export const SocialProofSection = () => {
  return (
    <section className="py-16 bg-white border-t border-gray-100">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 items-center max-w-4xl mx-auto opacity-60">
          {companies.map((company, index) => (
            <div 
              key={index}
              className="flex items-center justify-center"
            >
              <div className="text-xl font-bold text-gray-400">
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
  "FutureX"
];