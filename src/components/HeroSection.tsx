import { ArrowUpRight } from "lucide-react";
import { usePopup } from "@/hooks/usePopup";

const HeroSection = () => {
  const { open } = usePopup();
  return (
    <section className="section-plain min-h-svh flex flex-col justify-center pt-20 pb-16 relative">

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2.5 px-4 md:px-5 py-2 rounded-full bg-white border border-nlm-stroke mb-8 md:mb-10">
            <span className="w-2 h-2 rounded-full bg-nlm-blue animate-pulse" />
            <span className="text-[13px] md:text-sm text-nlm-secondary font-body">
              Usado por +100 clínicas premium no Brasil
            </span>
          </div>

          <h1 className="font-display text-[clamp(28px,4.8vw,56px)] font-medium leading-[1.12] tracking-[-0.01em] mb-6 md:mb-8 text-balance">
            Tenha em sua clínica o primeiro sistema do Brasil que{" "}
            <span className="text-gradient">atrai, qualifica e agenda</span>{" "}
            pacientes que pagam caro na sua cadeira, utilizando tráfego pago.
          </h1>

          <p className="text-nlm-secondary text-base md:text-xl max-w-2xl mx-auto mb-8 md:mb-12 leading-relaxed font-body">
            Em 47 minutos de conversa estratégica, vamos montar o plano pra lotar sua agenda com pacientes que pagam de{" "}
            <strong className="text-nlm-title">R$3k a R$15k por procedimento</strong>, sem pechinchar.
          </p>

          <button type="button" onClick={open} className="btn-primary">
            <span>Agendar Sessão Estratégica</span>
            <ArrowUpRight className="w-5 h-5" />
          </button>

          {/* Stats row - attributed to real clients */}
          <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto mt-16">
            {[
              { value: "+200%", label: "Agendamentos", client: "Dra. Kelly" },
              { value: "126", label: "Consultas/ano", client: "Dr. Humberto" },
              { value: "6.5x", label: "Faturamento", client: "Dr. Raí" },
            ].map((stat, i) => (
              <div key={i} className="card-outline px-4 py-5 text-center">
                <p className="text-nlm-blue font-display text-xl md:text-2xl font-medium tabular-nums">
                  {stat.value}
                </p>
                <p className="text-nlm-secondary text-xs mt-1 font-body">{stat.label}</p>
                <p className="text-nlm-secondary text-xs mt-0.5 font-body">{stat.client}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
