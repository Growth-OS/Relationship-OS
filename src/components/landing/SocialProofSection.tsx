export const SocialProofSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-2xl font-semibold text-center text-gray-600 mb-12 animate-fade-in">
          Trusted by Growing Businesses Worldwide
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center max-w-4xl mx-auto">
          {companies.map((company, index) => (
            <div 
              key={index}
              className="flex items-center justify-center animate-fade-in [animation-delay:200ms]"
            >
              <div className="h-12 flex items-center justify-center">
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {company}
                </div>
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