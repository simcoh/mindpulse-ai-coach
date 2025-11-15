import { AppSidebar } from "@/components/AppSidebar";
import { WeeklySurvey } from "@/components/WeeklySurvey";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const WeeklySurveyPage = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUserId(session.user.id);
      }
    });
  }, [navigate]);

  const handleSurveySubmit = async (responses: any) => {
    console.log("Survey submitted:", responses);
  };

  if (!userId) return null;

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-foreground mb-6">Weekly Survey</h1>
            <WeeklySurvey onSubmit={handleSurveySubmit} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default WeeklySurveyPage;
