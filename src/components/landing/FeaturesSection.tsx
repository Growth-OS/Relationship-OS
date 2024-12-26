import { Target, Zap, BarChart } from "lucide-react";

export const FeaturesSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl font-bold mb-4">Everything You Need to Scale</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            One platform to manage your entire business operations and growth strategy
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow animate-fade-in [animation-delay:200ms] hover:scale-105 transform transition-transform duration-300"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const features = [
  {
    title: "AI-Powered Growth",
    description: "Leverage artificial intelligence to automate your business processes and make data-driven decisions.",
    icon: Zap
  },
  {
    title: "All-in-One Platform",
    description: "Manage your entire business operations from a single, unified dashboard with powerful integrations.",
    icon: Target
  },
  {
    title: "Scale Faster",
    description: "Accelerate your growth with automated workflows, intelligent insights, and proven strategies.",
    icon: BarChart
  }
];