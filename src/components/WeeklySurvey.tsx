import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mic, MicOff } from "lucide-react";

interface WeeklySurveyProps {
  onSubmit: (responses: {
    mood: string;
    wellbeing: string;
    health: string;
    productivity: string;
    goals: string;
    risks: string;
    voiceInput?: string;
  }) => void;
  onCancel?: () => void;
}

export const WeeklySurvey = ({ onSubmit, onCancel }: WeeklySurveyProps) => {
  const [responses, setResponses] = useState({
    mood: "",
    wellbeing: "",
    health: "",
    productivity: "",
    goals: "",
    risks: "",
  });
  const [isRecording, setIsRecording] = useState(false);
  const [voiceInput, setVoiceInput] = useState<string>("");

  const questions = [
    { key: "mood", label: "How would you describe your overall mood this week?" },
    { key: "wellbeing", label: "How is your mental and emotional wellbeing?" },
    { key: "health", label: "How is your physical health and energy level?" },
    { key: "productivity", label: "How productive did you feel this week?" },
    { key: "goals", label: "What are your main goals for next week?" },
    { key: "risks", label: "Any concerns about burnout, conflicts, or personal difficulties?" },
  ];

  const handleSubmit = () => {
    onSubmit({ ...responses, voiceInput });
  };

  const handleVoiceToggle = () => {
    if (!isRecording) {
      // Start recording simulation (you can implement actual voice recording)
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        setVoiceInput("Voice recording captured");
      }, 3000);
    }
  };

  return (
    <div className="bg-chat-assistant border border-border rounded-2xl p-6 space-y-4 animate-slide-up">
      <h3 className="text-lg font-semibold text-foreground mb-4">Weekly Survey</h3>
      
      {questions.map((q) => (
        <div key={q.key} className="space-y-2">
          <Label className="text-sm font-medium text-foreground">{q.label}</Label>
          <Textarea
            value={responses[q.key as keyof typeof responses]}
            onChange={(e) => setResponses({ ...responses, [q.key]: e.target.value })}
            placeholder="Your response..."
            className="bg-background border-border text-foreground"
            rows={2}
          />
        </div>
      ))}

      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">Voice Input (Optional)</Label>
        <div className="flex gap-2">
          <Button
            type="button"
            variant={isRecording ? "destructive" : "outline"}
            size="sm"
            onClick={handleVoiceToggle}
            className="flex items-center gap-2"
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            {isRecording ? "Recording..." : "Record Voice"}
          </Button>
          {voiceInput && <span className="text-sm text-muted-foreground self-center">{voiceInput}</span>}
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button onClick={handleSubmit} className="flex-1">
          Submit Survey
        </Button>
        {onCancel && (
          <Button onClick={onCancel} variant="outline">
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
};
