import { ArrowUpRight } from "lucide-react";
import { usePopup } from "@/hooks/usePopup";
import { useTrackSectionView } from "@/hooks/useTrackSectionView";

const CTASection = () => {
  const { open } = usePopup();
  const sectionRef = useTrackSectionView<HTMLElement>("lp-03-cta");
  return (
    <section ref={sectionRef} className="section-cream py-24 md:py-32" id="contato">
      <div className="container mx-auto px-6">
        {/* Dark card inside cream section */}
        <div className="max-w-3xl mx-auto bg-nsm-dark-1 rounded-3xl text-center p-10 md:p-14 relative overflow-hidden">
          {/* Subtle glow */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at center, rgba(140,255,46,0.06) 0%, transparent 70%)",
            }}
          />

          <div className="relative z-10">
            <p className="section-label justify-center">(09) Próximo passo</p>

            <h2 className="font-display text-2xl md:text-3xl font-medium text-white mb-4">
              Aplicar para a{" "}
              <span className="text-nsm-green">Sessão Estratégica NSM</span>
            </h2>

            <p className="text-white/50 text-lg mb-10 font-body">
              2 minutos agora podem mudar seus próximos 12 meses.
            </p>

            <button type="button" onClick={open} className="btn-neon inline-flex">
              <span>Agendar Sessão Estratégica</span>
              <ArrowUpRight className="w-5 h-5" />
            </button>

            <div className="mt-14 space-y-4 text-left max-w-xl mx-auto">
              <p className="text-white/40 text-sm leading-relaxed font-body">
                <strong className="text-white">P.S:</strong> Não fazemos "reunião de vendas". É uma conversa estratégica. Se fizer sentido para ambos, seguimos. Se não, você sai com insights valiosos de qualquer forma.
              </p>

              <p className="text-white/40 text-sm leading-relaxed font-body">
                <strong className="text-white">P.P.S:</strong> A Dra. Kelly fechou 3 procedimentos high ticket na semana depois de implementar nosso sistema. Não estou dizendo que vai acontecer com você. <span className="text-nsm-green font-medium">Mas e se acontecer?</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
