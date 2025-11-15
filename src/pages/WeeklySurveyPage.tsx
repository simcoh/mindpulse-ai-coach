import { AppSidebar } from "@/components/AppSidebar";
import { WeeklySurvey } from "@/components/WeeklySurvey";
import { AdminWeeklySurvey } from "@/components/AdminWeeklySurvey";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";
import { startOfWeek } from "date-fns";

const WeeklySurveyPage = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const { isAdmin } = useUserRole(userId);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUserId(session.user.id);
      }
    });
  }, [navigate]);

  const handleEmployeeSurveySubmit = async (responses: any) => {
    if (!userId) return;

    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }).toISOString().split('T')[0];
    
    const { error } = await supabase.from("weekly_surveys").insert({
      user_id: userId,
      week_start: weekStart,
      ...responses,
    });

    if (error) {
      console.error("Error submitting survey:", error);
    } else {
      navigate("/");
    }
  };

  const handleAdminSurveySubmit = async (responses: any) => {
    if (!userId) return;

    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }).toISOString().split('T')[0];
    
    const { error } = await supabase.from("admin_weekly_surveys").insert({
      admin_id: userId,
      week_start: weekStart,
      ...responses,
    });

    if (error) {
      console.error("Error submitting admin survey:", error);
    } else {
      navigate("/admin/chat");
    }
  };

  if (!userId) return null;

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-foreground mb-6">
              {isAdmin ? "Manager Weekly Check-In" : "Weekly Survey"}
            </h1>
            {isAdmin ? (
              <AdminWeeklySurvey onSubmit={handleAdminSurveySubmit} />
            ) : (
              <WeeklySurvey onSubmit={handleEmployeeSurveySubmit} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default WeeklySurveyPage;
