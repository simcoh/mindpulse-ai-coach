import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoodSelector } from "@/components/MoodSelector";
import { ChatInterface } from "@/components/ChatInterface";
import { MoodChart } from "@/components/MoodChart";
import { Brain, LogOut, Target, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [moodData, setMoodData] = useState<any[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        loadProfile(session.user.id);
        loadMoodData(session.user.id);
      } else {
        navigate("/auth");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        loadProfile(session.user.id);
      } else {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    
    if (data) {
      setProfile(data);
    }
  };

  const loadMoodData = async (userId: string) => {
    const { data } = await supabase
      .from("check_ins")
      .select("*")
      .eq("user_id", userId)
      .eq("type", "emoji")
      .order("date", { ascending: true })
      .limit(7);

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

  const handleMoodSubmit = async () => {
    if (!selectedMood || !user) return;

    const { error } = await supabase.from("check_ins").insert([{
      user_id: user.id,
      type: "emoji" as const,
      mood: selectedMood as any,
    }]);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save mood. Please try again.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success!",
      description: "Your mood has been recorded.",
    });

    setSelectedMood(null);
    loadMoodData(user.id);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center glow-effect">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
                  MindPulse
                </h1>
                <p className="text-xs text-muted-foreground">
                  {profile?.role === "admin" ? "Admin Dashboard" : "Employee Dashboard"}
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={handleSignOut} className="gap-2">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Daily Check-In
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">How are you feeling today?</p>
                <MoodSelector selectedMood={selectedMood} onMoodSelect={setSelectedMood} />
                {selectedMood && (
                  <Button onClick={handleMoodSubmit} className="w-full glow-effect">
                    Submit Mood
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card className="bg-card border-border h-[500px]">
              <CardHeader>
                <CardTitle>Chat with MindPulse</CardTitle>
              </CardHeader>
              <CardContent className="h-[calc(100%-5rem)] p-0">
                <ChatInterface userId={user.id} />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {moodData.length > 0 && <MoodChart data={moodData} />}
            
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Check-ins this week</span>
                  <span className="text-2xl font-bold text-primary">{moodData.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Streak</span>
                  <span className="text-2xl font-bold text-accent">3 days</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
