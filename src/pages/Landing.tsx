import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Zap, Inbox, Clock } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-sm z-50 border-b">
        <div className="container mx-auto px-6 py-4">
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
              Sign In
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-primary mb-6 leading-tight tracking-tight">
              The Fastest Content OS Ever Made
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Supercharge your content creation workflow. 
              Turn hours of work into minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => navigate('/login')}
                className="text-lg px-8 bg-primary hover:bg-primary/90"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-16 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Lightning Fast</h3>
              <p className="text-gray-600 leading-relaxed">
                AI-powered automation that helps you create content in seconds, not hours.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Inbox className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">All-in-One</h3>
              <p className="text-gray-600 leading-relaxed">
                Manage content, tasks, and growth initiatives in a single, unified platform.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Time-Saving</h3>
              <p className="text-gray-600 leading-relaxed">
                Automated workflows and smart templates save hours every week.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-2xl md:text-3xl font-medium text-gray-600 leading-relaxed">
              "Growth OS has transformed how we manage our content operations. 
              What used to take days now takes minutes."
            </p>
            <div className="mt-8">
              <p className="font-semibold text-primary">Sarah Chen</p>
              <p className="text-gray-600">Head of Content, TechScale</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6 leading-tight tracking-tight">
              Ready to Transform Your Workflow?
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Join thousands of creators who are scaling their business with Growth OS.
            </p>
            <Button 
              size="lg"
              onClick={() => navigate('/login')}
              className="text-lg px-8 bg-primary hover:bg-primary/90"
            >
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t">
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