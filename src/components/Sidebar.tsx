import { Home, Calendar, Edit, ListTodo, Lightbulb, Users, ChartBar, BookOpen, Settings2, Briefcase, UserPlus, Inbox, Sparkles } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Badge } from "./ui/badge";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Error signing out');
    }
  };
  
  const mainMenuItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: UserPlus, label: "Prospects", path: "/dashboard/prospects" },
    { icon: Briefcase, label: "CRM", path: "/dashboard/crm" },
    { icon: Edit, label: "Content", path: "/dashboard/content" },
    { icon: ListTodo, label: "Tasks", path: "/dashboard/tasks" },
    { icon: Lightbulb, label: "Ideas", path: "/dashboard/ideas" },
    { icon: BookOpen, label: "Substack", path: "/dashboard/substack" },
    { icon: Users, label: "Affiliates", path: "/dashboard/affiliates" },
    { icon: ChartBar, label: "Reporting", path: "/dashboard/reporting" },
  ];

  const betaFeatures = [
    { 
      icon: Inbox, 
      label: "Inbox", 
      path: "/dashboard/inbox",
      beta: true
    },
    { 
      icon: Calendar, 
      label: "Calendar", 
      path: "/dashboard/calendar",
      beta: true
    },
  ];

  const renderMenuItem = (item: any) => {
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
        {item.beta && (
          <Badge variant="secondary" className="ml-auto text-xs">
            <Sparkles className="w-3 h-3 mr-1" />
            Beta
          </Badge>
        )}
      </Link>
    );
  };

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 p-4 fixed left-0 top-0 flex flex-col">
      <div className="flex items-center space-x-2 mb-8 px-2">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <span className="text-white font-bold">G</span>
        </div>
        <h1 className="text-xl font-bold text-primary">Growth OS</h1>
      </div>
      
      <nav className="space-y-1 flex-1">
        {mainMenuItems.map(renderMenuItem)}
      </nav>

      <div className="pt-4 border-t border-gray-200">
        <div className="mb-4 space-y-1">
          {betaFeatures.map(renderMenuItem)}
        </div>
        
        <button
          onClick={() => navigate('/settings')}
          className="w-full flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <Settings2 className="w-5 h-5" />
          <span>Settings</span>
        </button>
        <Button
          variant="outline"
          className="w-full"
          onClick={handleSignOut}
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;