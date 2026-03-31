import { useEffect } from "react";
import { useQuizModal } from "@/hooks/useQuizModal";
import { trackConversion } from "@/lib/tracking";
import { trackPixel } from "@/lib/meta-pixel";

type DqVariant = "dq-a" | "dq-b" | "dq-c" | "dq-d";

interface DisqualificationScreenProps {
  variant: DqVariant;
}

const DQ_REASONS: Record<DqVariant, string> = {
  "dq-a": "not_health_clinic",
  "dq-b": "no_clinic_yet",
  "dq-c": "no_revenue_yet",
  "dq-d": "not_ready_to_invest",
};

const DQ_MESSAGES: Record<DqVariant, string> = {
  "dq-a":
    "A NSM atende exclusivamente clínicas de saúde, então não conseguimos te ajudar dessa vez. Desejamos sucesso!",
  "dq-b":
    "Nosso sistema é pra quem já atende e quer escalar. Quando abrir sua clínica, vai ser um prazer te ajudar!",
  "dq-c":
    "Trabalhamos com clínicas que já faturam e querem crescer. Quando começar a faturar, a gente tá aqui!",
  "dq-d":
    "Tranquilo! Quando quiser dar o próximo passo, a gente tá aqui. Enquanto isso, segue o @pedroactis.ads pra conteúdos gratuitos.",
};

const WHATSAPP_URL = "https://wa.me/557183860639";

export default function DisqualificationScreen({ variant }: DisqualificationScreenProps) {
  const { close } = useQuizModal();
  const message = DQ_MESSAGES[variant];

  useEffect(() => {
    trackConversion('quiz_disqualified', { variant, reason: DQ_REASONS[variant] });
    trackPixel('QuizDisqualified', { variant, reason: DQ_REASONS[variant] });
  }, [variant]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 pt-20 pb-10">
      <div className="quiz-slide-up flex flex-col items-center text-center max-w-lg">
        {/* Message */}
        <p className="text-white/90 text-xl md:text-2xl font-body mb-10 leading-relaxed">
          {message}
        </p>

        {/* CTA: Voltar ao site */}
        <button
          type="button"
          onClick={close}
          className="btn-neon mb-4"
        >
          Voltar ao site
        </button>

        {/* Secondary link: WhatsApp */}
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-nsm-green/70 hover:text-nsm-green text-sm font-body underline underline-offset-4 transition-colors"
        >
          Falar com a equipe
        </a>
      </div>
    </div>
  );
}
