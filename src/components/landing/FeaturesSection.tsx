import { Mail, MessageSquare, Clock, Zap } from "lucide-react";

export const FeaturesSection = () => {
  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto space-y-16">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-6">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">
                  {feature.title}
                </h3>
                <p className="text-white/70 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const features = [
  {
    icon: Mail,
    title: "Integrated Email Management",
    description: "Fly through your email twice as fast as before. Our smart inbox helps you focus on what matters most, eliminating email anxiety once and for all."
  },
  {
    icon: MessageSquare,
    title: "Smart Team Communication",
    description: "Keep your team aligned with integrated chat, threads, and real-time collaboration tools. Make decisions faster and keep everyone in the loop."
  },
  {
    icon: Clock,
    title: "Efficient Task Management",
    description: "Transform how you handle tasks with our intuitive system. Set priorities, track progress, and achieve more with less effort."
  },
  {
    icon: Zap,
    title: "AI-Powered Automation",
    description: "Let AI handle repetitive tasks while you focus on what matters. Automate workflows and boost your productivity with smart suggestions."
  }
];