import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface AdminWeeklySurveyProps {
  onSubmit: (responses: {
    team_status: string;
    conflicts: string;
    concerns: string;
    workload: string;
    support_needed: string;
  }) => void;
  onCancel?: () => void;
}

export const AdminWeeklySurvey = ({ onSubmit, onCancel }: AdminWeeklySurveyProps) => {
  const [responses, setResponses] = useState({
    team_status: "",
    conflicts: "",
    concerns: "",
    workload: "",
    support_needed: "",
  });

  const questions = [
    { key: "team_status", label: "How is your team doing overall this week?" },
    { key: "conflicts", label: "Did any conflicts or issues arise?" },
    { key: "concerns", label: "Are you concerned about any teammate's behavior or wellbeing?" },
    { key: "workload", label: "How is the workload distribution in your team?" },
    { key: "support_needed", label: "Do you need support managing a difficult situation?" },
  ];

  const handleSubmit = () => {
    onSubmit(responses);
  };

  return (
    <div className="bg-chat-assistant border border-border rounded-2xl p-6 space-y-4 animate-slide-up">
      <h3 className="text-lg font-semibold text-foreground mb-4">Weekly Manager Check-In</h3>
      
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

      <div className="flex gap-2 pt-4">
        <Button onClick={handleSubmit} className="flex-1">
          Submit Check-In
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
