import { ArrowRight } from "lucide-react";

export const StepsSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-4 animate-fade-in">
          How to Scale Your Business in 3 Simple Steps
        </h2>
        <p className="text-xl text-gray-600 text-center mb-16 max-w-2xl mx-auto animate-fade-in [animation-delay:200ms]">
          Get started in minutes and see results within days
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="relative animate-fade-in [animation-delay:400ms]"
            >
              <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <step.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                <p className="text-gray-600 mb-6">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <ArrowRight className="hidden md:block absolute top-1/2 -right-6 w-8 h-8 text-blue-300 -translate-y-1/2" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const steps = [
  {
    title: "Connect Your Tools",
    description: "Integrate your existing tools and data sources with one-click connections.",
    icon: ArrowRight
  },
  {
    title: "Set Up Automation",
    description: "Choose from pre-built automation templates or create custom workflows.",
    icon: ArrowRight
  },
  {
    title: "Scale Your Growth",
    description: "Monitor your progress and optimize your operations with AI-powered insights.",
    icon: ArrowRight
  }
];