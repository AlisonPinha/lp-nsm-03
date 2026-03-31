import { useQuiz } from "../QuizProvider";
import { useQuizKeyboard } from "../useQuizKeyboard";
import { getNextStep } from "../quizConfig";
import QuizScreenLayout from "../QuizScreenLayout";

export function S17Situation() {
  const { state, dispatch, goToStep } = useQuiz();
  const { answers } = state;

  const handleContinue = () => {
    goToStep(getNextStep("situation", answers));
  };

  useQuizKeyboard({
    onEnter: handleContinue,
  });

  return (
    <QuizScreenLayout
      title="Conta um pouco da sua situação atual"
      subtitle="Opcional"
      showContinue
      continueDisabled={false}
      continueLabel={answers.situation ? "Continuar" : "Pular"}
      onContinue={handleContinue}
    >
      <div className="w-full max-w-lg mx-auto">
        <textarea
          value={answers.situation}
          onChange={(e) =>
            dispatch({
              type: "SET_ANSWER",
              field: "situation",
              value: e.target.value,
            })
          }
          placeholder="Ex: Tenho uma clínica de estética em BH, faço harmonização e quero atrair mais pacientes de alto valor..."
          className="bg-nsm-dark-3 border border-white/[0.15] rounded-xl px-5 py-4 text-white w-full max-w-lg h-36 resize-none font-body text-lg placeholder:text-white/30 focus:outline-none focus:border-nsm-green focus:ring-1 focus:ring-nsm-green/30 transition-colors leading-relaxed"
        />
      </div>
    </QuizScreenLayout>
  );
}

export default S17Situation;
