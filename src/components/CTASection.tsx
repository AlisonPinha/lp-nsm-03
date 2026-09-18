import { ArrowUpRight } from "lucide-react";
import { usePopup } from "@/hooks/usePopup";
import { useTrackSectionView } from "@/hooks/useTrackSectionView";

const CTASection = () => {
  const { open } = usePopup();
  const sectionRef = useTrackSectionView<HTMLElement>("lp-03-cta");
  return (
    <section ref={sectionRef} className="section-tint py-24 md:py-32" id="contato">
      <div className="container mx-auto px-6">
        {/* Card branco sobre a seção lavanda */}
        <div className="max-w-3xl mx-auto bg-white rounded-2xl text-center p-10 md:p-14 relative overflow-hidden">

          <div className="relative z-10">
            <p className="section-label justify-center">(09) Próximo passo</p>

            <h2 className="font-display text-2xl md:text-3xl font-normal mb-4">
              Aplicar para a{" "}
              <span className="text-nlm-blue">Sessão Estratégica NSM</span>
            </h2>

            <p className="text-nlm-secondary text-lg mb-10 font-body">
              2 minutos agora podem mudar seus próximos 12 meses.
            </p>

            <button type="button" onClick={open} className="btn-primary inline-flex">
              <span>Agendar Sessão Estratégica</span>
              <ArrowUpRight className="w-5 h-5" />
            </button>

            <div className="mt-14 space-y-4 text-left max-w-xl mx-auto">
              <p className="text-nlm-secondary text-sm leading-relaxed font-body">
                <strong className="text-nlm-title">P.S:</strong> Não fazemos "reunião de vendas". É uma conversa estratégica. Se fizer sentido para ambos, seguimos. Se não, você sai com insights valiosos de qualquer forma.
              </p>

              <p className="text-nlm-secondary text-sm leading-relaxed font-body">
                <strong className="text-nlm-title">P.P.S:</strong> A Dra. Kelly fechou 3 procedimentos high ticket na semana depois de implementar nosso sistema. Não estou dizendo que vai acontecer com você. <span className="text-nlm-blue font-medium">Mas e se acontecer?</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
