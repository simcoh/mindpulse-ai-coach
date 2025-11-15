import { MessageSquare, TrendingUp, Settings, LogOut } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { Brain } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export const AppSidebar = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <aside className="w-64 bg-sidebar border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center glow-effect">
            <Brain className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-xl font-bold text-primary-foreground">
            MindPulse
          </h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <NavLink
          to="/"
          end
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-primary/10 transition-colors"
          activeClassName="bg-primary/20 font-medium"
        >
          <MessageSquare className="w-5 h-5" />
          <span>Chat</span>
        </NavLink>

        <NavLink
          to="/stats"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-primary/10 transition-colors"
          activeClassName="bg-primary/20 font-medium"
        >
          <TrendingUp className="w-5 h-5" />
          <span>Quick Stats</span>
        </NavLink>

        <NavLink
          to="/settings"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-primary/10 transition-colors"
          activeClassName="bg-primary/20 font-medium"
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </NavLink>
      </nav>

      {/* Sign Out */}
      <div className="p-4 border-t border-border">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-destructive/10 transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
