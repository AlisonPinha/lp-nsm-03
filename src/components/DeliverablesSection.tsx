import { ArrowUpRight, BarChart3, Target, ClipboardList, AlertTriangle, Calculator } from "lucide-react";
import { usePopup } from "@/hooks/usePopup";

const entregaveis = [
  {
    icon: BarChart3,
    title: "Diagnóstico Personalizado da Sua Captação",
    description: "Vamos mapear exatamente por que sua clínica ainda não atrai pacientes de alto valor de forma previsível e o caminho mais curto para mudar isso em 90 dias."
  },
  {
    icon: Target,
    title: "A Fórmula dos 3 Pilares da Clínica Premium",
    description: 'Como nossos clientes saíram de "mais uma clínica que faz procedimento" para "a referência que todo mundo quer", mesmo cobrando 2x mais que a concorrência.'
  },
  {
    icon: ClipboardList,
    title: "Seu Plano de Ação 90 Dias",
    description: "Saia com um roteiro claro e específico do que fazer nas próximas 12 semanas, mesmo que decida não trabalhar conosco."
  },
  {
    icon: AlertTriangle,
    title: "Os 5 Erros Fatais que Queimam Clínicas",
    description: "O erro que vemos se repetir em quase toda clínica que chega até nós: investir em marketing sem um sistema de qualificação. Leads baratos que nunca fecham. Vamos te mostrar como evitar isso."
  },
  {
    icon: Calculator,
    title: "Calculadora de Pacientes Perdidos",
    description: "Vamos calcular juntos: quantos pacientes de alto valor você está perdendo todo mês por não ter um sistema de captação e qualificação estruturado."
  }
];

const DeliverablesSection = () => {
  const { open } = usePopup();
  return (
    <section className="section-cream py-24 md:py-32" id="entregaveis">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <p className="section-label-dark">(04) Entregáveis</p>
          <h2 className="font-display text-2xl md:text-3xl font-medium text-nsm-dark-3">
            O que você leva dessa{" "}
            <span className="text-nsm-green">sessão da NSM?</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {entregaveis.slice(0, 3).map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div key={index} className="card-light p-7 group hover:-translate-y-1 transition-all duration-300">
                <div className="w-11 h-11 rounded-xl bg-nsm-green/10 flex items-center justify-center mb-5 group-hover:bg-nsm-green/15 transition-colors">
                  <IconComponent className="w-5 h-5 text-nsm-green" />
                </div>
                <h3 className="font-display text-lg font-semibold text-nsm-dark-3 mb-3">{item.title}</h3>
                <p className="text-nsm-dark-3/60 text-sm leading-relaxed font-body">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="grid md:grid-cols-2 gap-5 max-w-3xl mx-auto mb-16">
          {entregaveis.slice(3, 5).map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div key={index} className="card-light p-7 group hover:-translate-y-1 transition-all duration-300">
                <div className="w-11 h-11 rounded-xl bg-nsm-green/10 flex items-center justify-center mb-5 group-hover:bg-nsm-green/15 transition-colors">
                  <IconComponent className="w-5 h-5 text-nsm-green" />
                </div>
                <h3 className="font-display text-lg font-semibold text-nsm-dark-3 mb-3">{item.title}</h3>
                <p className="text-nsm-dark-3/60 text-sm leading-relaxed font-body">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <button type="button" onClick={open} className="btn-neon inline-flex">
            <span>Agendar Sessão Estratégica</span>
            <ArrowUpRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default DeliverablesSection;
