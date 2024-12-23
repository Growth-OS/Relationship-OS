import { Card } from "@/components/ui/card";
import { Calendar, Edit, ListTodo, Lightbulb, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PhantombusterPanel } from "@/components/phantombuster/PhantombusterPanel";

const Dashboard = () => {
  const navigate = useNavigate();
  
  const stats = [
    {
      icon: Mail,
      label: "Inbox",
      value: "Connect Gmail",
      color: "bg-blue-500",
      onClick: () => navigate('/dashboard/inbox')
    },
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card 
              key={index} 
              className={`p-6 hover:shadow-lg transition-shadow ${stat.onClick ? 'cursor-pointer' : ''}`}
              onClick={stat.onClick}
            >
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

      <Card className="p-6">
        <PhantombusterPanel />
      </Card>
    </div>
  );
};

export default Dashboard;