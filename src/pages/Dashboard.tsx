import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { EnhancedChatInterface } from "@/components/EnhancedChatInterface";
import { AppSidebar } from "@/components/AppSidebar";
import { NudgesList } from "@/components/NudgesList";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        navigate("/auth");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-background w-full">
      <AppSidebar />
      <main className="flex-1 flex flex-col">
        <div className="p-4 border-b border-border">
          <NudgesList userId={user.id} limit={3} />
        </div>
        <div className="flex-1">
          <EnhancedChatInterface userId={user.id} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
