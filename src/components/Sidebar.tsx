import { Home, Calendar, Edit, ListTodo, Lightbulb, Users, ChartBar, BookOpen } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: Calendar, label: "Calendar", path: "/calendar" },
    { icon: Edit, label: "Content", path: "/content" },
    { icon: ListTodo, label: "Tasks", path: "/tasks" },
    { icon: Lightbulb, label: "Ideas", path: "/ideas" },
    { icon: Users, label: "Affiliates", path: "/affiliates" },
    { icon: ChartBar, label: "Reporting", path: "/reporting" },
    { icon: BookOpen, label: "Substack", path: "/substack" },
  ];

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 p-4 fixed left-0 top-0">
      <div className="flex items-center space-x-2 mb-8 px-2">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <span className="text-white font-bold">G</span>
        </div>
        <h1 className="text-xl font-bold text-primary">Growth OS</h1>
      </div>
      
      <nav className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;