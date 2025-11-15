import { cn } from "@/lib/utils";
import robotImage from "@/assets/robot.png";
import userImage from "@/assets/user.png";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

export const ChatMessage = ({ role, content }: ChatMessageProps) => {
  const isUser = role === "user";

  return (
    <div className={cn("flex gap-3 mb-4 animate-slide-up", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
          <img src={robotImage} alt="MindPulse" className="w-full h-full object-cover" />
        </div>
      )}
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 shadow-lg",
          isUser
            ? "bg-chat-user border border-primary/20"
            : "bg-chat-assistant border border-border"
        )}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
          <img src={userImage} alt="User" className="w-full h-full object-cover" />
        </div>
      )}
    </div>
  );
};
