import { useQuiz } from "../QuizProvider";
import { useQuizKeyboard } from "../useQuizKeyboard";
import { getNextStep } from "../quizConfig";
import QuizScreenLayout from "../QuizScreenLayout";
import QuizOptionButton from "../QuizOptionButton";

const OPTIONS = [
  { label: "Pode ligar, sem problema", key: "1" },
  { label: "Prefiro WhatsApp", key: "2" },
];

export function S18ContactPref() {
  const { state, dispatch, goToStep } = useQuiz();
  const { answers } = state;

  const handleSelect = (value: string) => {
    dispatch({ type: "SET_ANSWER", field: "contactPref", value });
    setTimeout(() => {
      goToStep(getNextStep("contact-pref", { ...answers, contactPref: value }));
    }, 300);
  };

  useQuizKeyboard({
    onEnter: () => {
      if (answers.contactPref) {
        goToStep(getNextStep("contact-pref", answers));
      }
    },
    options: OPTIONS.map((opt) => ({
      key: opt.key,
      action: () => handleSelect(opt.label),
    })),
  });

  return (
    <QuizScreenLayout title="Preferência de contato">
      <p className="text-white/70 text-base md:text-lg font-body leading-relaxed text-center max-w-lg mb-8">
        Antes da sessão, fazemos uma ligação rápida de 5 minutos pra confirmar
        algumas informações e preparar tudo pro seu caso.
      </p>

      <div className="flex flex-col gap-3 w-full max-w-lg mx-auto">
        {OPTIONS.map((opt) => (
          <QuizOptionButton
            key={opt.label}
            label={opt.label}
            selected={answers.contactPref === opt.label}
            onClick={() => handleSelect(opt.label)}
            shortcutKey={opt.key}
          />
        ))}
      </div>
    </QuizScreenLayout>
  );
}

export default S18ContactPref;
