import { Star } from "lucide-react";

export const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12 animate-fade-in">
          Why Customers Love Growth OS
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in [animation-delay:200ms]"
            >
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6">{testimonial.content}</p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold mr-3">
                  {testimonial.name.charAt(0)}
                </div>
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
  );
};

const testimonials = [
  {
    content: "Growth OS has transformed how we manage our business operations. The AI-powered features have saved us countless hours.",
    name: "Sarah Chen",
    role: "CEO, TechScale"
  },
  {
    content: "The all-in-one platform approach has streamlined our entire workflow. It's like having an entire operations team.",
    name: "Michael Ross",
    role: "Founder, StartupX"
  },
  {
    content: "We've seen a 3x increase in productivity since implementing Growth OS. The automation features are game-changing.",
    name: "Emily Parker",
    role: "COO, GrowthLabs"
  }
];