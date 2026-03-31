import { Check } from "lucide-react";

interface QuizOptionButtonProps {
  label: string;
  description?: string;
  selected: boolean;
  onClick: () => void;
  shortcutKey?: string;
}

export default function QuizOptionButton({
  label,
  description,
  selected,
  onClick,
  shortcutKey,
}: QuizOptionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full max-w-lg mx-auto rounded-2xl border backdrop-blur-md px-6 py-5 flex items-center gap-4 cursor-pointer transition-all duration-200 mb-3 text-left ${
        selected
          ? "border-nsm-green bg-nsm-green/10"
          : "bg-white/[0.07] border-white/[0.12] hover:border-nsm-green/50 hover:bg-white/[0.10]"
      }`}
    >
      {/* Shortcut key badge */}
      {shortcutKey && (
        <span className="flex-shrink-0 w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-sm text-white/60 font-mono font-semibold">
          {shortcutKey}
        </span>
      )}

      {/* Label and description */}
      <div className="flex-1 min-w-0">
        <span className="text-white font-semibold text-base block">{label}</span>
        {description && (
          <span className="text-white/60 text-sm mt-1 block">{description}</span>
        )}
      </div>

      {/* Circle indicator */}
      <span
        className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
          selected
            ? "border-nsm-green bg-nsm-green"
            : "border-white/20"
        }`}
      >
        {selected && <Check className="w-3 h-3 text-nsm-dark-1" strokeWidth={3} />}
      </span>
    </button>
  );
}
