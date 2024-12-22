import { Home, Calendar, Edit, ListTodo, Lightbulb, Users, ChartBar, BookOpen, Wand2, Settings2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Sidebar = () => {
  const location = useLocation();
  
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
              <Settings2 className="w-5 h-5" />
              <span>Settings</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuItem asChild>
              <Link to="/ai-prompts" className="flex items-center cursor-pointer">
                <Wand2 className="w-4 h-4 mr-2" />
                AI Prompts
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/ai-persona" className="flex items-center cursor-pointer">
                <Wand2 className="w-4 h-4 mr-2" />
                AI Persona
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Sidebar;