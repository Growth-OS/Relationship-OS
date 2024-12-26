export const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-white border-t border-gray-100">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">
          <blockquote className="text-2xl md:text-3xl font-medium mb-8">
            "Growth OS is better than any other platform we've tried, and we've tried them all."
          </blockquote>
          <div className="flex items-center justify-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-600 font-bold">JB</span>
            </div>
            <div className="text-left">
              <div className="font-semibold">Jonathan Bayme</div>
              <div className="text-gray-600">CEO of Theory11</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};