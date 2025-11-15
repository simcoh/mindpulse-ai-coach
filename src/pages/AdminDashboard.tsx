import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  completedWeeklySurvey: boolean;
  moodmeterScore: number | null;
  aiSummary: string | null;
}

const AdminDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        loadTeamMembers();
      } else {
        navigate("/auth");
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadTeamMembers = async () => {
    // Get all profiles with their weekly survey status
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, email, name")
      .neq("id", user?.id);

    if (!profiles) return;

    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const weekStartStr = weekStart.toISOString().split("T")[0];

    const membersWithSurveys = await Promise.all(
      profiles.map(async (profile) => {
        const { data: survey } = await supabase
          .from("weekly_surveys")
          .select("moodmeter_score, ai_summary")
          .eq("user_id", profile.id)
          .eq("week_start", weekStartStr)
          .single();

        return {
          id: profile.id,
          name: profile.name || profile.email.split("@")[0],
          email: profile.email,
          completedWeeklySurvey: !!survey,
          moodmeterScore: survey?.moodmeter_score || null,
          aiSummary: survey?.ai_summary || null,
        };
      })
    );

    setTeamMembers(membersWithSurveys);
  };

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-background w-full">
      <AppSidebar />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-6 max-w-6xl">
          <h2 className="text-3xl font-bold text-foreground mb-6">Team Overview</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamMembers.map((member) => (
              <Card key={member.id} className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-foreground">
                    <span className="text-lg">{member.name}</span>
                    {member.completedWeeklySurvey ? (
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-destructive" />
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">{member.email}</p>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">Status:</span>
                    <Badge variant={member.completedWeeklySurvey ? "default" : "destructive"}>
                      {member.completedWeeklySurvey ? "Survey Complete" : "Pending"}
                    </Badge>
                  </div>

                  {member.moodmeterScore !== null && (
                    <div className="mt-2">
                      <span className="text-sm font-medium text-foreground">Moodmeter: </span>
                      <span className="text-lg font-bold text-primary">
                        {member.moodmeterScore}/100
                      </span>
                    </div>
                  )}

                  {member.aiSummary && (
                    <div className="mt-2 p-2 bg-background rounded border border-border">
                      <p className="text-xs text-muted-foreground">AI Summary:</p>
                      <p className="text-sm text-foreground mt-1">{member.aiSummary}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {teamMembers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No team members found.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
