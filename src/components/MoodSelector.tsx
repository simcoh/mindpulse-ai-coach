import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const moods = [
  { emoji: "😄", label: "Very Happy", value: "very_happy" },
  { emoji: "🙂", label: "Happy", value: "happy" },
  { emoji: "😐", label: "Neutral", value: "neutral" },
  { emoji: "😟", label: "Sad", value: "sad" },
  { emoji: "😢", label: "Very Sad", value: "very_sad" },
];

interface MoodSelectorProps {
  selectedMood: string | null;
  onMoodSelect: (mood: string) => void;
}

export const MoodSelector = ({ selectedMood, onMoodSelect }: MoodSelectorProps) => {
  return (
    <div className="flex gap-3 justify-center flex-wrap">
      {moods.map((mood) => (
        <Button
          key={mood.value}
          variant="outline"
          size="lg"
          onClick={() => onMoodSelect(mood.value)}
          className={cn(
            "text-4xl hover:scale-110 transition-all duration-200",
            selectedMood === mood.value && "ring-2 ring-primary glow-effect"
          )}
          title={mood.label}
        >
          {mood.emoji}
        </Button>
      ))}
    </div>
  );
};
