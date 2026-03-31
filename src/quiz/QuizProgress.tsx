import { ChevronLeft, X } from "lucide-react";
import { useQuiz } from "./QuizProvider";
import { useQuizModal } from "@/hooks/useQuizModal";
import { getProgress } from "./quizConfig";

export default function QuizProgress() {
  const { state, goBack } = useQuiz();
  const { close } = useQuizModal();

  const progress = getProgress(state.currentStep);

  return (
    <div className="fixed top-0 left-0 right-0 z-[101] bg-nsm-dark-1/95 backdrop-blur-sm px-6 py-4">
      <div className="flex items-center gap-4">
        {/* Back arrow */}
        <button
          type="button"
          onClick={goBack}
          className={`flex-shrink-0 w-8 h-8 flex items-center justify-center text-white/60 hover:text-white transition-colors ${
            state.history.length === 0 ? "invisible" : ""
          }`}
          aria-label="Voltar"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Progress bar */}
        <div className="flex-1 h-1.5 bg-nsm-dark-4 rounded-full overflow-hidden">
          <div
            className="h-full bg-nsm-green rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Close X */}
        <button
          type="button"
          onClick={close}
          className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-white/60 hover:text-white transition-colors"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
