import { ArrowRight } from "lucide-react";

export const FeaturesSection = () => {
  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <div className="space-y-8">
            <div className="p-6 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-colors">
              <h3 className="text-xl font-semibold mb-3">Fly through your email</h3>
              <p className="text-white/70">twice as fast as before.</p>
            </div>
            <div className="p-6 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-colors">
              <h3 className="text-xl font-semibold mb-3">Reply faster with instant filters</h3>
              <p className="text-white/70">Focus on what matters most.</p>
            </div>
          </div>
          <div className="space-y-8">
            <div className="p-6 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-colors">
              <h3 className="text-xl font-semibold mb-3">Smart email organization</h3>
              <p className="text-white/70">Let AI handle the sorting for you.</p>
            </div>
            <div className="p-6 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-colors">
              <h3 className="text-xl font-semibold mb-3">Team collaboration</h3>
              <p className="text-white/70">Work together seamlessly.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};