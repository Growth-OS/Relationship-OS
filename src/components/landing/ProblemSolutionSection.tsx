import { Check, X } from "lucide-react";

export const ProblemSolutionSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12 animate-fade-in">
          Honestly Now, Is This The Way To Scale Your Business?
        </h2>
        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Problems Column */}
          <div className="space-y-6 animate-fade-in [animation-delay:200ms]">
            <h3 className="text-2xl font-semibold text-red-600 mb-6">Common Frustrations</h3>
            {problems.map((problem, index) => (
              <div key={index} className="flex items-start gap-4 p-4 bg-red-50 rounded-lg">
                <X className="w-6 h-6 text-red-600 shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">{problem.title}</h4>
                  <p className="text-gray-600">{problem.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Solutions Column */}
          <div className="space-y-6 animate-fade-in [animation-delay:400ms]">
            <h3 className="text-2xl font-semibold text-green-600 mb-6">Our Solution</h3>
            {solutions.map((solution, index) => (
              <div key={index} className="flex items-start gap-4 p-4 bg-green-50 rounded-lg">
                <Check className="w-6 h-6 text-green-600 shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">{solution.title}</h4>
                  <p className="text-gray-600">{solution.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const problems = [
  {
    title: "Manual Data Entry",
    description: "Hours spent on spreadsheets and repetitive tasks that could be automated."
  },
  {
    title: "Scattered Tools",
    description: "Using multiple disconnected tools leading to inefficiency and data silos."
  },
  {
    title: "Lack of Insights",
    description: "No clear visibility into business performance and growth opportunities."
  }
];

const solutions = [
  {
    title: "AI-Powered Automation",
    description: "Automate 80% of your manual tasks with intelligent workflows and data processing."
  },
  {
    title: "All-in-One Platform",
    description: "Everything you need in one place - from CRM to financial tracking and content management."
  },
  {
    title: "Real-time Analytics",
    description: "Get instant insights into your business performance with advanced analytics and reporting."
  }
];