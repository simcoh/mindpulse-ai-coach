import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoodChart } from "@/components/MoodChart";
import { Target, TrendingUp } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";

const Stats = () => {
  const [user, setUser] = useState<any>(null);
  const [moodData, setMoodData] = useState<any[]>([]);
  const [checkInStreak, setCheckInStreak] = useState(0);
  const [weeklySurveyCompleted, setWeeklySurveyCompleted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        loadMoodData(session.user.id);
        loadCheckInStreak(session.user.id);
        checkWeeklySurvey(session.user.id);
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

  const loadMoodData = async (userId: string) => {
    const { data } = await supabase
      .from("check_ins")
      .select("*")
      .eq("user_id", userId)
      .eq("type", "emoji")
      .order("date", { ascending: true })
      .limit(14);

    if (data) {
      const moodMap: any = {
        very_sad: 1,
        sad: 2,
        neutral: 3,
        happy: 4,
        very_happy: 5,
      };

      const chartData = data.map((item) => ({
        date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        value: moodMap[item.mood] || 3,
      }));

      setMoodData(chartData);
    }
  };

  const loadCheckInStreak = async (userId: string) => {
    const { count } = await supabase
      .from("check_ins")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);
    
    setCheckInStreak(count || 0);
  };

  const checkWeeklySurvey = async (userId: string) => {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const weekStartStr = weekStart.toISOString().split("T")[0];

    const { data } = await supabase
      .from("weekly_surveys")
      .select("*")
      .eq("user_id", userId)
      .eq("week_start", weekStartStr)
      .single();

    setWeeklySurveyCompleted(!!data);
  };

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-6 max-w-5xl">
          <h2 className="text-3xl font-bold text-foreground mb-6">Quick Stats</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Target className="w-5 h-5 text-primary" />
                  Check-In Streak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-primary">{checkInStreak}</div>
                <p className="text-sm text-muted-foreground mt-2">Total check-ins</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Weekly Survey
                </CardTitle>
              </CardHeader>
              <CardContent>
                {weeklySurveyCompleted ? (
                  <div className="flex items-center gap-2">
                    <div className="text-4xl">✓</div>
                    <p className="text-sm text-muted-foreground">Completed</p>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">Not completed this week</div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Recent Mood
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl">
                  {moodData.length > 0 ? 
                    moodData[moodData.length - 1].value >= 4 ? "😊" : 
                    moodData[moodData.length - 1].value === 3 ? "😐" : "😔"
                  : "😐"}
                </div>
                <p className="text-sm text-muted-foreground mt-2">Current state</p>
              </CardContent>
            </Card>
          </div>

          <MoodChart data={moodData} />
        </div>
      </main>
    </div>
  );
};

export default Stats;
