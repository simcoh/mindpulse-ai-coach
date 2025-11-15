import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AppSidebar } from "@/components/AppSidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { ChatMessage } from "@/components/ChatMessage";
import { ScrollArea } from "@/components/ui/scroll-area";

const AdminChat = () => {
  const [user, setUser] = useState<any>(null);
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        initializeAdminChat();
      } else {
        navigate("/auth");
      }
    });
  }, [navigate]);

  const initializeAdminChat = () => {
    setMessages([
      {
        role: "assistant",
        content: "Welcome to the Admin portal. How is your team doing this week?",
      },
    ]);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user" as const, content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage = {
        role: "assistant" as const,
        content: "Thank you for the feedback. Is there anything specific you'd like to discuss about team management or any concerns?",
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 1000);
  };

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-background w-full">
      <AppSidebar />
      <main className="flex-1 flex flex-col">
        <ScrollArea className="flex-1 px-4 py-6">
          {messages.map((message, index) => (
            <ChatMessage key={index} role={message.role} content={message.content} />
          ))}
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
