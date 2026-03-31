import type { ReactNode } from "react";
import { Shield } from "lucide-react";

interface QuizScreenLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  showContinue?: boolean;
  onContinue?: () => void;
  continueLabel?: string;
  continueDisabled?: boolean;
}

export default function QuizScreenLayout({
  children,
  title,
  subtitle,
  showContinue = false,
  onContinue,
  continueLabel = "Continuar",
  continueDisabled = false,
}: QuizScreenLayoutProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 pt-20 pb-10">
      <div className="quiz-slide-up flex flex-col items-center w-full">
        {/* Title */}
        <h2 className="font-display text-3xl md:text-[42px] font-semibold text-white text-center mb-5 max-w-2xl leading-tight">
          {title}
        </h2>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-white/70 text-lg md:text-xl text-center mb-10 max-w-xl font-body leading-relaxed">
            {subtitle}
          </p>
        )}

        {/* Children slot (options, inputs, etc.) */}
        {children}

        {/* Continue button */}
        {showContinue && (
          <div className="flex flex-col items-center mt-10">
            <button
              type="button"
              onClick={onContinue}
              disabled={continueDisabled}
              className={`btn-neon ${
                continueDisabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {continueLabel}
            </button>

            {/* Enter hint */}
            <span className="text-white/30 text-sm mt-4 font-body">
              Pressione Enter ↵
            </span>
          </div>
        )}

        {/* Trust footer */}
        <div className="flex items-center gap-1.5 mt-auto pt-8 text-white/30 text-xs font-body">
          <Shield className="w-3.5 h-3.5" />
          <span>Suas informações estão protegidas</span>
        </div>
      </div>
    </div>
  );
}
