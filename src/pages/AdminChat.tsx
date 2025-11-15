import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AppSidebar } from "@/components/AppSidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { ChatMessage } from "@/components/ChatMessage";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AdminWeeklySurvey } from "@/components/AdminWeeklySurvey";
import { startOfWeek } from "date-fns";

const AdminChat = () => {
  const [user, setUser] = useState<any>(null);
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);
  const [input, setInput] = useState("");
  const [showWeeklySurvey, setShowWeeklySurvey] = useState(false);
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        initializeAdminChat(session.user.id);
      } else {
        navigate("/auth");
      }
    });
  }, [navigate]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, showWeeklySurvey]);

  const initializeAdminChat = async (userId: string) => {
    setMessages([
      {
        role: "assistant",
        content: "Welcome to the Admin portal. How is your team doing this week?",
      },
    ]);
    
    await checkWeeklySurvey(userId);
  };

  const checkWeeklySurvey = async (userId: string) => {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const weekStartStr = weekStart.toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('admin_weekly_surveys')
      .select('*')
      .eq('admin_id', userId)
      .eq('week_start', weekStartStr)
      .maybeSingle();

    if (error) {
      console.error('Error checking weekly survey:', error);
      return;
    }

    if (!data) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          role: "assistant",
          content: "It's time for your weekly manager check-in. Please take a moment to fill out the form below."
        }]);
        setShowWeeklySurvey(true);
      }, 1000);
    }
  };

  const handleWeeklySurveySubmit = async (responses: any) => {
    if (!user) return;

    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const weekStartStr = weekStart.toISOString().split('T')[0];

    const { error } = await supabase
      .from('admin_weekly_surveys')
      .insert({
        admin_id: user.id,
        week_start: weekStartStr,
        ...responses
      });

    if (error) {
      console.error('Error saving survey:', error);
      return;
    }

    setShowWeeklySurvey(false);
    setMessages(prev => [...prev, {
      role: "assistant",
      content: "Thank you for completing your weekly manager check-in. I've recorded your responses. How else can I assist you today?"
    }]);
  };

  const handleSend = async () => {
    if (!input.trim() || !user) return;

    const userMessage = { role: "user" as const, content: input };
    setMessages((prev) => [...prev, userMessage]);
    const messageText = input;
    setInput("");

    try {
      const { data, error } = await supabase.functions.invoke("admin-coach", {
        body: { message: messageText },
      });

      if (error) throw error;

      const assistantMessage = {
        role: "assistant" as const,
        content: data.response,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = {
        role: "assistant" as const,
        content: "I'm sorry, I encountered an error. Please try again or check your connection.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-background w-full">
      <AppSidebar />
      <main className="flex-1 flex flex-col">
        <ScrollArea className="flex-1 px-4 py-6">
          <div className="max-w-4xl mx-auto">
            {messages.map((message, index) => (
              <ChatMessage key={index} role={message.role} content={message.content} />
            ))}
            
            {showWeeklySurvey && (
              <div className="mb-4">
                <AdminWeeklySurvey
                  onSubmit={handleWeeklySurveySubmit}
                  onCancel={() => setShowWeeklySurvey(false)}
                />
              </div>
            )}
            
            <div ref={scrollRef} />
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-border bg-card">
          <div className="flex gap-2 max-w-4xl mx-auto">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Share team updates..."
              className="flex-1"
            />
            <Button onClick={handleSend} disabled={!input.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminChat;
