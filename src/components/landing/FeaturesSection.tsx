import { LayoutTemplate, BarChart3, Users } from "lucide-react";

export const FeaturesSection = () => {
  return (
    <section className="py-20 bg-white border-t border-gray-100">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="text-left">
              <div className="w-12 h-12 border border-gray-200 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-black">{feature.title}</h3>
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
    title: "Beautiful dashboards that are responsive and customizable",
    description: "No technical skills needed. You have complete control over the look and feel of your workspace.",
    icon: LayoutTemplate
  },
  {
    title: "Pricing as low as $29/month",
    description: "Whether you manage tasks, track deals, or analyze metrics, Growth OS helps you scale. Start growing anywhere for just $29/month.",
    icon: BarChart3
  },
  {
    title: "Trusted by over 10,000 businesses",
    description: "Growth OS handles everything from task management and deal tracking to secure data analytics and reporting.",
    icon: Users
  }
];