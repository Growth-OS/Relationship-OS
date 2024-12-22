import { Home, Calendar, Edit, ListTodo, Lightbulb, Users, ChartBar, BookOpen, Settings2 } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: Calendar, label: "Calendar", path: "/calendar" },
    { icon: Edit, label: "Content", path: "/content" },
    { icon: ListTodo, label: "Tasks", path: "/tasks" },
    { icon: Lightbulb, label: "Ideas", path: "/ideas" },
    { icon: BookOpen, label: "Substack", path: "/substack" },
    { icon: Users, label: "Affiliates", path: "/affiliates" },
    { icon: ChartBar, label: "Reporting", path: "/reporting" },
  ];

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 p-4 fixed left-0 top-0 flex flex-col">
      <div className="flex items-center space-x-2 mb-8 px-2">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <span className="text-white font-bold">G</span>
        </div>
        <h1 className="text-xl font-bold text-primary">Growth OS</h1>
      </div>
      
      <nav className="space-y-1 flex-1">
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

      {/* Settings Section */}
      <div className="mt-auto pt-4 border-t border-gray-200">
        <button
          onClick={() => navigate('/settings')}
          className="w-full flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <Settings2 className="w-5 h-5" />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;