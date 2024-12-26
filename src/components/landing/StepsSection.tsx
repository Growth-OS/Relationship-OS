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
    title: "Have perfect timing with Smart Late",
    description: "Schedule emails to be sent at the perfect time",
    timeframe: "In 3 days"
  },
  {
    title: "Reply faster with instant filters",
    description: "Focus on what matters most",
    timeframe: "Coming soon"
  },
  {
    title: "Improve interactions with social insights",
    description: "Get better context for your emails",
    timeframe: "Available now"
  },
  {
    title: "Use machine learning to spot latency",
    description: "Identify bottlenecks in your communication",
    timeframe: "Beta"
  }
];