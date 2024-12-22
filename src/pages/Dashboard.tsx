import { Card } from "@/components/ui/card";
import { Calendar, Edit, ListTodo, Lightbulb } from "lucide-react";

const Dashboard = () => {
  const stats = [
    {
      icon: Edit,
      label: "Content Pieces",
      value: "12",
      color: "bg-content-blog",
    },
    {
      icon: Calendar,
      label: "Scheduled Posts",
      value: "8",
      color: "bg-content-podcast",
    },
    {
      icon: ListTodo,
      label: "Active Tasks",
      value: "5",
      color: "bg-content-social",
    },
    {
      icon: Lightbulb,
      label: "Ideas",
      value: "15",
      color: "bg-secondary",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">Welcome back!</h1>
        <p className="text-gray-600">Here's an overview of your content ecosystem</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-primary">{stat.value}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Upcoming Content</h2>
          <div className="space-y-4">
            {[
              { title: "Blog Post: Growth Strategies", type: "blog", date: "Tomorrow" },
              { title: "Podcast: Marketing Tips", type: "podcast", date: "In 2 days" },
              { title: "Social: LinkedIn Update", type: "social", date: "Next week" },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full bg-content-${item.type}`} />
                  <span className="font-medium">{item.title}</span>
                </div>
                <span className="text-sm text-gray-600">{item.date}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Ideas</h2>
          <div className="space-y-4">
            {[
              "Content Strategy for Q2",
              "New Podcast Series",
              "Social Media Campaign",
            ].map((idea, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                <span>{idea}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;