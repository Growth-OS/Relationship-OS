import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  ArrowRight, 
  Star, 
  CheckCircle2, 
  ArrowUpRight, 
  Clock, 
  Zap,
  Target,
  Users,
  BarChart,
  MessageSquare
} from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-sm z-50 border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">G</span>
              </div>
              <span className="text-xl font-bold">Growth OS</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost"
                onClick={() => navigate('/login')}
              >
                Log in
              </Button>
              <Button 
                onClick={() => navigate('/signup')}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Start Free Trial
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Transform Your Business Growth With AI-Powered Automation
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              The all-in-one platform that helps you automate your business operations, 
              track growth metrics, and scale faster with artificial intelligence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => navigate('/signup')}
                className="text-lg px-8 bg-blue-500 hover:bg-blue-600 text-white"
              >
                Start Your Growth Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate('/demo')}
                className="text-lg px-8"
              >
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Product Features */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything You Need to Scale</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              One platform to manage your entire business operations and growth strategy
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-semibold text-center mb-12">
            Trusted by Growing Businesses Worldwide
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-60">
            {companies.map((company, index) => (
              <div key={index} className="h-12">
                <img 
                  src={company.logo} 
                  alt={company.name}
                  className="h-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem-Solution */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Is This Really The Way To Grow Your Business?
          </h2>
          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold mb-4">Common Frustrations</h3>
              {problems.map((problem, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-1 text-red-500">
                    <problem.icon className="w-5 h-5" />
                  </div>
                  <p className="text-gray-600">{problem.text}</p>
                </div>
              ))}
            </div>
            <div className="space-y-6">
              <h3 className="text-xl font-semibold mb-4">Our Solution</h3>
              {solutions.map((solution, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-1 text-green-500">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <p className="text-gray-600">{solution}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            How to Scale Your Business in 3 Simple Steps
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-blue-500">{index + 1}</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Customers Love Growth OS
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6">{testimonial.content}</p>
                <div className="flex items-center">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-500 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">
              You're One Step Away From Transforming Your Business
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Join thousands of businesses scaling their growth with Growth OS
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => navigate('/signup')}
                className="text-lg px-8 bg-white text-blue-500 hover:bg-blue-50"
              >
                Start Free Trial
                <ArrowUpRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate('/demo')}
                className="text-lg px-8 border-white text-white hover:bg-blue-600"
              >
                Schedule Demo
              </Button>
            </div>
            <p className="mt-6 text-sm text-blue-100">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">G</span>
              </div>
              <span className="text-xl font-bold">Growth OS</span>
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

const companies = [
  { name: "Company 1", logo: "/placeholder.svg" },
  { name: "Company 2", logo: "/placeholder.svg" },
  { name: "Company 3", logo: "/placeholder.svg" },
  { name: "Company 4", logo: "/placeholder.svg" }
];

const problems = [
  { 
    text: "Too many tools and platforms to manage",
    icon: Target
  },
  { 
    text: "Manual processes eating up valuable time",
    icon: Clock
  },
  { 
    text: "Lack of actionable insights from data",
    icon: BarChart
  }
];

const solutions = [
  "Unified platform for all your business needs",
  "AI-powered automation saves hours daily",
  "Real-time analytics and actionable insights"
];

const steps = [
  {
    title: "Connect Your Tools",
    description: "Integrate your existing tools and platforms in minutes with our simple setup process."
  },
  {
    title: "Automate Workflows",
    description: "Let AI handle your routine tasks while you focus on strategic growth initiatives."
  },
  {
    title: "Scale Your Business",
    description: "Monitor your growth metrics and optimize your operations in real-time."
  }
];

const testimonials = [
  {
    content: "Growth OS has transformed how we manage our business operations. The AI-powered features have saved us countless hours.",
    name: "Sarah Chen",
    role: "CEO, TechScale",
    avatar: "/placeholder.svg"
  },
  {
    content: "The all-in-one platform approach has streamlined our entire workflow. It's like having an entire operations team.",
    name: "Michael Ross",
    role: "Founder, StartupX",
    avatar: "/placeholder.svg"
  },
  {
    content: "We've seen a 3x increase in productivity since implementing Growth OS. The automation features are game-changing.",
    name: "Emily Parker",
    role: "COO, GrowthLabs",
    avatar: "/placeholder.svg"
  }
];

export default Landing;