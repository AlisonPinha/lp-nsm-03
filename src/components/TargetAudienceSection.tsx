import { ArrowUpRight, Check } from "lucide-react";
import { useQuizModal } from "@/hooks/useQuizModal";

const criterios = [
  {
    text: "É dono(a) de clínica médica, odontológica ou estética",
    detail: "(e já fatura com procedimentos estéticos ou de alto valor)"
  },
  {
    text: "É profissional com mentalidade empresarial",
    detail: "(não apenas clínica)"
  },
  {
    text: "Entende que negócio precisa de investimento",
    detail: "(não busca milagre grátis)"
  },
  {
    text: "Está disposto(a) a seguir um sistema validado",
    detail: "(não reinventar a roda)"
  },
  {
    text: "Tem agenda para crescer",
    detail: "(pode atender 5-10 procedimentos premium/mês)"
  }
];

const TargetAudienceSection = () => {
  const { open } = useQuizModal();
  return (
    <section className="section-cream py-24 md:py-32 relative">
      {/* Watermark */}
      <div className="nsm-watermark right-8 top-1/2 -translate-y-1/2">nsm</div>

      <div className="container mx-auto px-6 relative">
        <div className="max-w-3xl mx-auto">
          <p className="section-label-dark">(05) Para quem é</p>

          <h2 className="font-display text-2xl md:text-3xl font-medium text-nsm-dark-3 mb-12">
            Esse plano é para <span className="text-nsm-green">você que:</span>
          </h2>

          <div className="space-y-4 mb-14">
            {criterios.map((criterio, index) => (
              <div
                key={index}
                className="card-light flex items-start gap-4 p-5"
              >
                <div className="w-7 h-7 rounded-full bg-nsm-green/15 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-nsm-green" />
                </div>
                <div>
                  <span className="font-medium text-nsm-dark-3">{criterio.text}</span>
                  <span className="text-nsm-dark-3/50 ml-1">{criterio.detail}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button type="button" onClick={open} className="btn-neon inline-flex">
              <span>Agendar Sessão Estratégica</span>
              <ArrowUpRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TargetAudienceSection;
