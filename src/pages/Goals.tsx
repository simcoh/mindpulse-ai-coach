import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Target, Plus, CheckCircle2, Circle, Trash2, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Goal {
  id: string;
  goal_text: string;
  progress: number;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

const Goals = () => {
  const [user, setUser] = useState<any>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [goalText, setGoalText] = useState("");
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        loadGoals(session.user.id);
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

  const loadGoals = async (userId: string) => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("goals")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading goals:", error);
      toast({
        title: "Error",
        description: "Failed to load goals.",
        variant: "destructive",
      });
    } else {
      setGoals(data || []);
    }
    setIsLoading(false);
  };

  const handleCreateGoal = async () => {
    if (!goalText.trim() || !user) return;

    try {
      const { error } = await supabase.from("goals").insert({
        user_id: user.id,
        goal_text: goalText.trim(),
        progress: 0,
        completed: false,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Goal created successfully!",
      });

      setGoalText("");
      setProgress(0);
      setIsDialogOpen(false);
      loadGoals(user.id);
    } catch (error: any) {
      console.error("Error creating goal:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create goal.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateGoal = async (goalId: string, updates: Partial<Goal>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("goals")
        .update(updates)
        .eq("id", goalId)
        .eq("user_id", user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Goal updated successfully!",
      });

      loadGoals(user.id);
    } catch (error: any) {
      console.error("Error updating goal:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update goal.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    if (!user) return;

    if (!confirm("Are you sure you want to delete this goal?")) return;

    try {
      const { error } = await supabase
        .from("goals")
        .delete()
        .eq("id", goalId)
        .eq("user_id", user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Goal deleted successfully!",
      });

      loadGoals(user.id);
    } catch (error: any) {
      console.error("Error deleting goal:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete goal.",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (goal: Goal) => {
    setEditingGoal(goal);
    setGoalText(goal.goal_text);
    setProgress(goal.progress);
    setIsDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingGoal || !goalText.trim()) return;

    await handleUpdateGoal(editingGoal.id, {
      goal_text: goalText.trim(),
      progress: progress,
    });

    setEditingGoal(null);
    setGoalText("");
    setProgress(0);
    setIsDialogOpen(false);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingGoal(null);
    setGoalText("");
    setProgress(0);
  };

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-6 max-w-4xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Target className="w-8 h-8 text-primary" />
              My Goals
            </h2>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => closeDialog()}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Goal
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingGoal ? "Edit Goal" : "Create New Goal"}</DialogTitle>
                  <DialogDescription>
                    {editingGoal ? "Update your goal details." : "Set a new goal to work towards."}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="goal-text">Goal</Label>
                    <Textarea
                      id="goal-text"
                      value={goalText}
                      onChange={(e) => setGoalText(e.target.value)}
                      placeholder="e.g., Improve work-life balance by taking regular breaks"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="progress">Progress: {progress}%</Label>
                    <Input
                      id="progress"
                      type="range"
                      min="0"
                      max="100"
                      value={progress}
                      onChange={(e) => setProgress(Number(e.target.value))}
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={closeDialog}>
                      Cancel
                    </Button>
                    <Button onClick={editingGoal ? handleSaveEdit : handleCreateGoal}>
                      {editingGoal ? "Save Changes" : "Create Goal"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading goals...</p>
            </div>
          ) : goals.length === 0 ? (
            <Card className="bg-card border-border">
              <CardContent className="py-12 text-center">
                <Target className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <CardDescription className="text-lg">
                  No goals yet. Create your first goal to get started!
                </CardDescription>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {goals.map((goal) => (
                <Card key={goal.id} className="bg-card border-border">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleUpdateGoal(goal.id, { completed: !goal.completed })}
                          className="mt-1"
                        >
                          {goal.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-primary" />
                          ) : (
                            <Circle className="w-5 h-5 text-muted-foreground" />
                          )}
                        </Button>
                        <div className="flex-1">
                          <CardTitle className={goal.completed ? "line-through text-muted-foreground" : ""}>
                            {goal.goal_text}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            Created {new Date(goal.created_at).toLocaleDateString()}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(goal)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteGoal(goal.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{goal.progress}%</span>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Goals;

