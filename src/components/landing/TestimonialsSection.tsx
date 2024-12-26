export const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-black border-t border-white/10">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <blockquote className="text-2xl md:text-3xl font-medium mb-8 text-white/90">
            "Growth OS has transformed how we manage our business. Having everything from CRM to content management in one place has increased our team's productivity by 40%."
          </blockquote>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
              <span className="text-white/70 font-bold">SK</span>
            </div>
            <div>
              <div className="font-semibold">Sarah Kim</div>
              <div className="text-white/70">CEO at TechGrowth</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};