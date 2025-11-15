import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Brain, Loader2 } from "lucide-react";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [selectedPanel, setSelectedPanel] = useState<"employee" | "admin" | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/");
      }
    });
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPanel) {
      toast({
        title: "Panel Selection Required",
        description: "Please select whether you want to access the Teammate Panel or Admin Panel.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
          },
        });
        if (error) throw error;
        
        // Insert the selected role for the new user
        if (data.user) {
          const { error: roleError } = await supabase
            .from('user_roles')
            .insert({
              user_id: data.user.id,
              role: selectedPanel
            });
          
          if (roleError) {
            console.error('Error setting user role:', roleError);
          }
        }
        
        toast({
          title: "Success!",
          description: "Account created. You can now sign in.",
        });
        setIsSignUp(false);
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        
        // Fetch user role to determine redirect
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', data.user.id)
          .single();
        
        const redirectPath = roleData?.role === 'admin' ? '/admin/chat' : '/';
        navigate(redirectPath);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card border-border shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <Brain className="w-7 h-7 text-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">
              MindPulse
            </h1>
          </div>
          <CardDescription className="text-muted-foreground">
            {isSignUp
              ? "Create your account to start your wellbeing journey"
              : "Welcome back to your personal AI coach"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-3">
              <Label className="text-sm font-medium">Select Panel *</Label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant={selectedPanel === "employee" ? "default" : "outline"}
                  onClick={() => setSelectedPanel("employee")}
                  className="h-20"
                >
                  <div className="text-center">
                    <div className="font-semibold">Teammate Panel</div>
                    <div className="text-xs mt-1 opacity-80">Access your personal dashboard</div>
                  </div>
                </Button>
                <Button
                  type="button"
                  variant={selectedPanel === "admin" ? "default" : "outline"}
                  onClick={() => setSelectedPanel("admin")}
                  className="h-20"
                >
                  <div className="text-center">
                    <div className="font-semibold">Admin Panel</div>
                    <div className="text-xs mt-1 opacity-80">Manage your team</div>
                  </div>
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-muted border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-muted border-border"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isSignUp ? "Creating Account..." : "Signing In..."}
                </>
              ) : (
                <>{isSignUp ? "Sign Up" : "Sign In"}</>
              )}
            </Button>
            <div className="text-center">
              <Button
                type="button"
                variant="link"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-primary"
              >
                {isSignUp ? "Already have an account? Sign In" : "Need an account? Sign Up"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
