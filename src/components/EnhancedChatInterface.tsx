import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";
import { ChatMessage } from "./ChatMessage";
import { MoodSelector } from "./MoodSelector";
import { WeeklySurvey } from "./WeeklySurvey";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  role: "user" | "assistant";
  content: string;
  isMoodPrompt?: boolean;
  isWeeklySurvey?: boolean;
}

interface EnhancedChatInterfaceProps {
  userId: string;
}

export const EnhancedChatInterface = ({ userId }: EnhancedChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [waitingForMood, setWaitingForMood] = useState(false);
  const [showWeeklySurvey, setShowWeeklySurvey] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadMessages();
    checkDailyCheckIn();
    checkWeeklySurvey();
  }, [userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const checkDailyCheckIn = async () => {
    const today = new Date().toISOString().split('T')[0];
    
    const { data } = await supabase
      .from("check_ins")
      .select("*")
      .eq("user_id", userId)
      .eq("type", "emoji")
      .gte("date", today)
      .single();

    if (!data) {
      // No check-in today, prompt for mood
      setTimeout(() => {
        const moodPrompt: Message = {
          role: "assistant",
          content: "Good to see you! How are you feeling today?",
          isMoodPrompt: true,
        };
        setMessages((prev) => [...prev, moodPrompt]);
        setWaitingForMood(true);
      }, 1000);
    }
  };

  const checkWeeklySurvey = async () => {
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

    if (!data) {
      setTimeout(() => {
        const surveyPrompt: Message = {
          role: "assistant",
          content: "It's time for your weekly survey! This helps me understand your overall wellbeing.",
          isWeeklySurvey: true,
        };
        setMessages((prev) => [...prev, surveyPrompt]);
        setShowWeeklySurvey(true);
      }, 2000);
    }
  };

  const loadMessages = async () => {
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error loading messages:", error);
      return;
    }

    if (data) {
      setMessages(data.map((msg) => ({ role: msg.role as "user" | "assistant", content: msg.content })));
    }
  };

  const handleMoodSelect = async (mood: string) => {
    if (!waitingForMood) return;

    const moodEmojis: any = {
      very_happy: "😄",
      happy: "🙂",
      neutral: "😐",
      sad: "😟",
      very_sad: "😢",
    };

    const userMessage: Message = { 
      role: "user", 
      content: moodEmojis[mood] || mood 
    };
    setMessages((prev) => [...prev, userMessage]);
    setWaitingForMood(false);

    // Save mood check-in
    await supabase.from("check_ins").insert({
      user_id: userId,
      type: "emoji" as const,
      mood: mood as any,
    });

    // Save user message
    await supabase.from("chat_messages").insert({
      user_id: userId,
      role: "user",
      content: moodEmojis[mood],
    });

    // Get AI response
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("chat-coach", {
        body: { message: `User mood: ${mood}` },
      });

      if (error) throw error;

      const assistantMessage: Message = {
        role: "assistant",
        content: data.response,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      await supabase.from("chat_messages").insert({
        user_id: userId,
        role: "assistant",
        content: data.response,
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleWeeklySurveySubmit = async (responses: any) => {
    setShowWeeklySurvey(false);

    const userMessage: Message = {
      role: "user",
      content: "Weekly survey completed ✓",
    };
    setMessages((prev) => [...prev, userMessage]);

    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const weekStartStr = weekStart.toISOString().split("T")[0];

    // Calculate moodmeter score (0-100)
    // Get recent moods for calculation
    const { data: recentMoodsData } = await supabase
      .from("check_ins")
      .select("mood, date")
      .eq("user_id", userId)
      .eq("type", "emoji")
      .order("date", { ascending: false })
      .limit(7);

    const { count: streakCount } = await supabase
      .from("check_ins")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    const { calculateMoodmeterScore } = await import("@/lib/moodmeter");
    const score = calculateMoodmeterScore({
      weeklySurvey: responses,
      recentMoods: (recentMoodsData || []).map(m => ({ mood: m.mood || "neutral", date: m.date })),
      checkInStreak: streakCount || 0,
    });

    // Generate AI summary
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("chat-coach", {
        body: {
          message: `Generate a brief summary of this weekly survey: ${JSON.stringify(responses)}`,
        },
      });

      if (error) throw error;

      await supabase.from("weekly_surveys").insert({
        user_id: userId,
        week_start: weekStartStr,
        mood: responses.mood,
        wellbeing: responses.wellbeing,
        health: responses.health,
        productivity: responses.productivity,
        goals: responses.goals,
        risks: responses.risks,
        voice_input: responses.voiceInput,
        moodmeter_score: score,
        ai_summary: data.response,
      });

      const assistantMessage: Message = {
        role: "assistant",
        content: "Thank you for completing your weekly survey! Your responses help me provide better support.",
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to submit survey. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setIsLoading(true);

    const newUserMessage: Message = { role: "user", content: userMessage };
    setMessages((prev) => [...prev, newUserMessage]);

    await supabase.from("chat_messages").insert({
      user_id: userId,
      role: "user",
      content: userMessage,
    });

    try {
      const { data, error } = await supabase.functions.invoke("chat-coach", {
        body: { message: userMessage },
      });

      if (error) throw error;

      const assistantMessage: Message = {
        role: "assistant",
        content: data.response,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      await supabase.from("chat_messages").insert({
        user_id: userId,
        role: "assistant",
        content: data.response,
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <ScrollArea className="flex-1 px-4 py-6">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            <p className="text-lg">Welcome to MindPulse!</p>
            <p className="text-sm mt-2">Your private AI coach for wellbeing and growth.</p>
          </div>
        )}
        {messages.map((message, index) => (
          <div key={index}>
            <ChatMessage role={message.role} content={message.content} />
            {message.isMoodPrompt && waitingForMood && (
              <div className="mb-6 ml-11 animate-slide-up">
                <MoodSelector selectedMood={null} onMoodSelect={handleMoodSelect} />
              </div>
            )}
            {message.isWeeklySurvey && showWeeklySurvey && (
              <div className="mb-6 ml-11">
                <WeeklySurvey onSubmit={handleWeeklySurveySubmit} />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-chat-assistant border border-border rounded-2xl px-4 py-3 ml-11">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </ScrollArea>

      <div className="p-4 border-t border-border bg-card">
        <div className="flex gap-2 max-w-4xl mx-auto">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="Share your thoughts..."
            className="flex-1"
            disabled={isLoading || waitingForMood || showWeeklySurvey}
          />
          <Button onClick={handleSend} disabled={isLoading || !input.trim() || waitingForMood || showWeeklySurvey}>
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
};
