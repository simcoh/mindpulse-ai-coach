import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Nudge {
  id: string;
  nudge_text: string;
  type: string | null;
  is_read: boolean;
  created_at: string;
  date: string;
}

interface NudgesListProps {
  userId: string;
  limit?: number;
}

export const NudgesList = ({ userId, limit = 5 }: NudgesListProps) => {
  const [nudges, setNudges] = useState<Nudge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadNudges();
  }, [userId]);

  const loadNudges = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("nudges")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error loading nudges:", error);
    } else {
      setNudges(data || []);
    }
    setIsLoading(false);
  };

  const markAsRead = async (nudgeId: string) => {
    try {
      const { error } = await supabase
        .from("nudges")
        .update({ is_read: true })
        .eq("id", nudgeId)
        .eq("user_id", userId);

      if (error) throw error;

      setNudges((prev) =>
        prev.map((n) => (n.id === nudgeId ? { ...n, is_read: true } : n))
      );
    } catch (error: any) {
      console.error("Error marking nudge as read:", error);
      toast({
        title: "Error",
        description: "Failed to update nudge.",
        variant: "destructive",
      });
    }
  };

  const deleteNudge = async (nudgeId: string) => {
    try {
      const { error } = await supabase
        .from("nudges")
        .delete()
        .eq("id", nudgeId)
        .eq("user_id", userId);

      if (error) throw error;

      setNudges((prev) => prev.filter((n) => n.id !== nudgeId));
      toast({
        title: "Success",
        description: "Nudge removed.",
      });
    } catch (error: any) {
      console.error("Error deleting nudge:", error);
      toast({
        title: "Error",
        description: "Failed to delete nudge.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="py-4">
          <p className="text-sm text-muted-foreground">Loading nudges...</p>
        </CardContent>
      </Card>
    );
  }

  if (nudges.length === 0) {
    return null;
  }

  const unreadCount = nudges.filter((n) => !n.is_read).length;

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bell className="w-5 h-5 text-primary" />
          Coaching Nudges
          {unreadCount > 0 && (
            <Badge variant="default" className="ml-2">
              {unreadCount} new
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {nudges.map((nudge) => (
          <div
            key={nudge.id}
            className={`p-3 rounded-lg border ${
              !nudge.is_read
                ? "bg-primary/5 border-primary/20"
                : "bg-muted/50 border-border"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                {nudge.type && (
                  <Badge variant="outline" className="mb-2 text-xs">
                    {nudge.type}
                  </Badge>
                )}
                <p className={`text-sm ${!nudge.is_read ? "font-medium" : ""}`}>
                  {nudge.nudge_text}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(nudge.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-1">
                {!nudge.is_read && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => markAsRead(nudge.id)}
                    title="Mark as read"
                  >
                    <Check className="w-3 h-3" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-destructive"
                  onClick={() => deleteNudge(nudge.id)}
                  title="Remove"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

