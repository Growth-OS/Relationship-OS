import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">G</span>
            </div>
            <span className="text-xl font-bold text-primary">Growth OS</span>
          </div>
          <Button 
            variant="outline"
            onClick={() => navigate('/login')}
            className="hover:bg-primary hover:text-white transition-colors"
          >
            Login
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6 leading-tight">
            Your All-in-One Growth & Content Management Platform
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Streamline your content creation, manage affiliates, and scale your business with our integrated platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => navigate('/login')}
              className="text-lg px-8"
            >
              Get Started
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="text-lg px-8"
              onClick={() => {
                const featuresSection = document.getElementById('features');
                featuresSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-12">
            Everything You Need to Grow
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Content Management",
                description: "Create, schedule, and manage your content across multiple platforms with ease.",
                icon: "📝"
              },
              {
                title: "Affiliate Program",
                description: "Track and manage your affiliate partnerships and earnings in one place.",
                icon: "🤝"
              },
              {
                title: "AI Integration",
                description: "Leverage AI to generate content ideas and streamline your workflow.",
                icon: "🤖"
              },
              {
                title: "Analytics Dashboard",
                description: "Get insights into your growth metrics with our comprehensive reporting.",
                icon: "📊"
              },
              {
                title: "Task Management",
                description: "Keep track of your projects and deadlines with our built-in task manager.",
                icon: "✅"
              },
              {
                title: "Substack Integration",
                description: "Seamlessly manage your Substack newsletter directly from Growth OS.",
                icon: "📧"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-primary">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
            Ready to Accelerate Your Growth?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of creators who are scaling their business with Growth OS.
          </p>
          <Button 
            size="lg"
            onClick={() => navigate('/login')}
            className="text-lg px-8"
          >
            Start Free Trial
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">G</span>
              </div>
              <span className="text-xl font-bold text-primary">Growth OS</span>
            </div>
            <div className="text-gray-600">
              © {new Date().getFullYear()} Growth OS. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;