import { ArrowUpRight } from "lucide-react";
import { usePopup } from "@/hooks/usePopup";

const HeroSection = () => {
  const { open } = usePopup();
  return (
    <section className="section-dark min-h-screen flex flex-col justify-center pt-20 pb-16 relative">
      {/* Radial glow behind title */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(140,255,46,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/5 border border-white/10 mb-10">
            <span className="w-2 h-2 rounded-full bg-nsm-green animate-pulse" />
            <span className="text-sm text-white/60 font-body">
              Usado por +32 clínicas premium no Brasil
            </span>
          </div>

          <h1 className="font-display text-[clamp(28px,4.5vw,46px)] font-medium leading-[1.15] mb-8 text-balance">
            Tenha em sua clínica o primeiro sistema do Brasil que{" "}
            <span className="text-nsm-green">atrai, qualifica e agenda</span>{" "}
            pacientes que pagam caro na sua cadeira, utilizando tráfego pago.
          </h1>

          <p className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-body">
            Em 47 minutos de conversa estratégica, vamos montar o plano pra lotar sua agenda com pacientes que pagam de{" "}
            <strong className="text-white">R$3k a R$15k por procedimento</strong>{" "}
            — sem pechinchar.
          </p>

          <button type="button" onClick={open} className="btn-neon">
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
              <div key={i} className="glass-card px-4 py-5 text-center">
                <p className="text-nsm-green font-display text-xl md:text-2xl font-semibold">
                  {stat.value}
                </p>
                <p className="text-white/40 text-xs mt-1 font-body">{stat.label}</p>
                <p className="text-white/25 text-[10px] mt-0.5 font-body">{stat.client}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
