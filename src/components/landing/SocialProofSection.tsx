export const SocialProofSection = () => {
  return (
    <section className="py-16 bg-black border-y border-white/10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-12 items-center max-w-4xl mx-auto opacity-60">
          {companies.map((company, index) => (
            <div 
              key={index}
              className="flex items-center justify-center"
            >
              <div className="text-xl font-bold text-white/40">
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
  "Spotify",
  "Netflix",
  "Stripe",
  "Deel",
  "Compass",
  "Linear"
];