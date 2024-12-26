import { ArrowRight } from "lucide-react";

export const FeaturesSection = () => {
  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <div className="space-y-8">
            <div className="p-6 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-colors">
              <h3 className="text-xl font-semibold mb-3">Smart CRM</h3>
              <p className="text-white/70">Track leads, manage deals, and close more sales with our intelligent CRM system.</p>
            </div>
            <div className="p-6 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-colors">
              <h3 className="text-xl font-semibold mb-3">Content Management</h3>
              <p className="text-white/70">Create and schedule content for multiple platforms with AI assistance.</p>
            </div>
          </div>
          <div className="space-y-8">
            <div className="p-6 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-colors">
              <h3 className="text-xl font-semibold mb-3">Financial Tools</h3>
              <p className="text-white/70">Track expenses, manage transactions, and monitor your business finances.</p>
            </div>
            <div className="p-6 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-colors">
              <h3 className="text-xl font-semibold mb-3">Task Management</h3>
              <p className="text-white/70">Stay organized with integrated task tracking and team collaboration tools.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};