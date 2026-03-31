import { useState } from "react";
import { useQuiz } from "../QuizProvider";
import { getNextStep } from "../quizConfig";
import { submitToClickUp } from "../submitToClickUp";
import { trackConversion } from "@/lib/tracking";
import { trackPixel } from "@/lib/meta-pixel";

export function S19SocialProof() {
  const { state, goToStep } = useQuiz();
  const { answers } = state;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContinue = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await submitToClickUp(answers);
      trackConversion('quiz_complete', {
        area: answers.area,
        revenue: answers.revenue,
        ad_spend: answers.adSpend,
      });
      trackPixel('QuizComplete', {
        area: answers.area,
        revenue: answers.revenue,
        ad_spend: answers.adSpend,
      });
    } catch (err) {
      console.error("Failed to submit to ClickUp:", err);
    } finally {
      setIsSubmitting(false);
      goToStep(getNextStep("social-proof", answers));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 pt-20 pb-10">
      <div className="quiz-slide-up flex flex-col items-center w-full max-w-2xl">
        <p className="text-white/80 text-lg md:text-xl font-body text-center mb-8 max-w-xl leading-relaxed">
          O Dr. Oduvaldo é ortopedista e já tinha passado por várias agências sem resultado.
        </p>
        <p className="text-white/70 text-base md:text-lg font-body text-center mb-10 max-w-xl leading-relaxed">
          Com a NSM, além dos pacientes que começaram a chegar, ele destaca o atendimento da equipe. São mais de 6 meses de parceria.
        </p>

        {/* Video - YouTube Short */}
        <div className="w-full max-w-sm rounded-2xl overflow-hidden bg-nsm-dark-3 mb-10" style={{ aspectRatio: "9/16" }}>
          <iframe
            src="https://www.youtube.com/embed/W2gODdsjhdo"
            title="Depoimento Dr. Oduvaldo"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          />
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <button
            type="button"
            className={`btn-neon ${isSubmitting ? "opacity-70 cursor-wait" : ""}`}
            onClick={handleContinue}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processando..." : "Quero uma parceria assim!"}
          </button>
          <button
            type="button"
            className="btn-neon-outline"
            onClick={handleContinue}
            disabled={isSubmitting}
          >
            Finalizar
          </button>
        </div>
      </div>
    </div>
  );
}

export default S19SocialProof;
