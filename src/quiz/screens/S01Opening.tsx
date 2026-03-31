import { useQuiz } from "../QuizProvider";
import { useQuizKeyboard } from "../useQuizKeyboard";

export function S01Opening() {
  const { dispatch } = useQuiz();

  const handleStart = () => {
    dispatch({ type: "GO_TO_STEP", step: "icp-filter" });
  };

  useQuizKeyboard({
    onEnter: handleStart,
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <h1 className="font-display text-[26px] md:text-5xl lg:text-[54px] font-bold text-white max-w-3xl leading-[1.15] mb-8">
        Vamos descobrir se o sistema NSM{" "}
        <span className="text-nsm-green">faz sentido</span>{" "}
        pra sua clínica?
      </h1>

      <p className="text-white/70 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed font-body">
        32 clínicas já usam nosso sistema pra atrair pacientes de alto valor.
        Responda algumas perguntas rápidas e receba um diagnóstico personalizado
        — leva menos de 2 minutos.
      </p>

      <div className="mb-10">
        <div className="inline-flex items-start gap-2.5 border border-red-500/30 bg-red-500/10 text-red-400 text-sm font-medium px-5 py-3.5 rounded-xl max-w-md text-left leading-relaxed">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse flex-shrink-0 mt-1" />
          <span>
            Aceitamos no máximo{" "}
            <strong className="text-red-300">5 novas clínicas por mês</strong> pra
            garantir dedicação total a cada projeto.
          </span>
        </div>
      </div>

      <button type="button" className="btn-neon" onClick={handleStart}>
        Começar Diagnóstico
      </button>
    </div>
  );
}

export default S01Opening;
