import CalendarPicker from "../CalendarPicker";

export function S20Confirmation() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 pt-20 pb-10">
      <div className="quiz-slide-up flex flex-col items-center w-full max-w-2xl">
        {/* Title */}
        <h2 className="font-display text-3xl md:text-[42px] font-semibold text-white text-center mb-5 max-w-2xl leading-tight">
          🎉 Você foi pré-selecionado(a) para a Sessão Estratégica NSM!
        </h2>

        <div className="text-white/70 text-base md:text-lg font-body text-center mb-10 max-w-xl leading-relaxed space-y-4">
          <p>
            Escolha um horário que funcione de verdade pra você. A gente leva essa conversa a sério.
          </p>
          <p>
            Não é uma reunião rápida e superficial. São{" "}
            <strong className="text-white">45 minutos</strong> com um
            especialista que já ajudou dezenas de clínicas a escalar.
          </p>
          <p className="text-white/80 font-medium">
            Selecione seu horário abaixo. Vamos te ligar antes pra confirmar.
          </p>
        </div>

        {/* Calendar */}
        <CalendarPicker />

        {/* Session label */}
        <p className="text-white/50 text-sm font-body mt-6">
          Sessão de Diagnóstico NSM
        </p>
      </div>
    </div>
  );
}

export default S20Confirmation;
