import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Star, CheckCircle2, ArrowUpRight } from "lucide-react";

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
                variant="outline"
                onClick={() => navigate('/signup')}
                className="hover:bg-blue-500 hover:text-white transition-colors"
              >
                Sign up free
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 text-center">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Scale Your Business Growth With AI-Powered Automation
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Turn your business operations into a streamlined system with Growth OS's integrated tools and AI assistance
            </p>
            <Button 
              size="lg"
              onClick={() => navigate('/signup')}
              className="text-lg px-8 bg-blue-500 hover:bg-blue-600"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Everything you need to grow faster</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Why Customers Love Growth OS</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-xl border">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">{testimonial.content}</p>
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
              Start Growing Your Business Today
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Join thousands of businesses scaling their growth with Growth OS
            </p>
            <Button 
              size="lg"
              variant="secondary"
              onClick={() => navigate('/signup')}
              className="text-lg px-8 bg-white text-blue-500 hover:bg-blue-50"
            >
              Get Started Now
              <ArrowUpRight className="ml-2 h-5 w-5" />
            </Button>
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
    icon: ArrowRight
  },
  {
    title: "All-in-One Platform",
    description: "Manage your entire business operations from a single, unified dashboard.",
    icon: CheckCircle2
  },
  {
    title: "Scale Faster",
    description: "Accelerate your growth with automated workflows and intelligent insights.",
    icon: ArrowUpRight
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
    content: "The all-in-one platform approach has streamlined our entire workflow. It's like having an entire operations team at your fingertips.",
    name: "Michael Ross",
    role: "Founder, StartupX",
    avatar: "/placeholder.svg"
  }
];

export default Landing;