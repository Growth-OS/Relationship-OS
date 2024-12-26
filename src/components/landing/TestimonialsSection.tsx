export const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-black border-t border-white/10">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <blockquote className="text-2xl md:text-3xl font-medium mb-8 text-white/90">
            "It's one thing for me to be better with my email, but if my whole team is better, then we tend to make decisions faster, respond faster, and give higher quality responses to everyone we interact with."
          </blockquote>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
              <span className="text-white/70 font-bold">JD</span>
            </div>
            <div>
              <div className="font-semibold">John Doe</div>
              <div className="text-white/70">CEO at TechCorp</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};