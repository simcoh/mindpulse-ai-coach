import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Phone, PhoneOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Coach = () => {
  const navigate = useNavigate();
  const [isInCall, setIsInCall] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      }
    });
  }, [navigate]);

  const handleStartCall = () => {
    setIsInCall(true);
  };

  const handleEndCall = () => {
    setIsInCall(false);
  };

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-foreground mb-6">Call My Coach</h1>
            
            <div className="bg-card rounded-lg p-8 text-center space-y-6">
              <div className="w-32 h-32 rounded-full bg-primary/10 mx-auto flex items-center justify-center">
                <Phone className="w-16 h-16 text-primary" />
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-2">
                  {isInCall ? "Connected to your AI Coach" : "Connect with your AI Coach"}
                </h2>
                <p className="text-muted-foreground">
                  {isInCall 
                    ? "You're now in a call with your coach. Speak freely about how you're feeling."
                    : "Start a voice call to discuss your wellbeing, goals, or any concerns you have."}
                </p>
              </div>

              {isInCall ? (
                <Button
                  onClick={handleEndCall}
                  variant="destructive"
                  size="lg"
                  className="gap-2"
                >
                  <PhoneOff className="w-5 h-5" />
                  End Call
                </Button>
              ) : (
                <Button
                  onClick={handleStartCall}
                  size="lg"
                  className="gap-2"
                >
                  <Phone className="w-5 h-5" />
                  Start Call
                </Button>
              )}

              {isInCall && (
                <div className="mt-8 p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    After the call, a summary will be sent to you in the chat.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Coach;
