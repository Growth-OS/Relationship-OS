export const StepsSection = () => {
  return (
    <section className="py-20 bg-black border-t border-white/10">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="p-6 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-colors"
            >
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-white/70">{step.description}</p>
              <div className="mt-4 text-sm text-white/50">{step.timeframe}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const steps = [
  {
    title: "Integrated Email Management",
    description: "Connect your email and manage all communications in one place",
    timeframe: "Available now"
  },
  {
    title: "AI-Powered Content Creation",
    description: "Generate engaging content with our AI writing assistant",
    timeframe: "Available now"
  },
  {
    title: "Advanced Analytics Dashboard",
    description: "Track your business metrics with detailed reporting",
    timeframe: "Available now"
  },
  {
    title: "Team Collaboration Tools",
    description: "Work together seamlessly with built-in collaboration features",
    timeframe: "Coming soon"
  }
];