import { useCallback } from "react";
import { useQuiz } from "../QuizProvider";
import QuizScreenLayout from "../QuizScreenLayout";
import QuizOptionButton from "../QuizOptionButton";
import { useQuizKeyboard } from "../useQuizKeyboard";
import { getNextStep } from "../quizConfig";

const OPTIONS = [
  "Medicina (ortopedia, cirurgia plástica, dermatologia, etc.)",
  "Odontologia (lentes, implantes, ortodontia, Invisalign, etc.)",
  "Estética (harmonização facial, corporal, etc.)",
  "Outro tipo de negócio",
] as const;

const SHORTCUT_LABELS = ["A", "B", "C", "D"];

export function S02IcpFilter() {
  const { state, dispatch } = useQuiz();

  const handleSelect = useCallback(
    (value: string) => {
      dispatch({ type: "SET_ANSWER", field: "area", value });
      const next = getNextStep("icp-filter", { ...state.answers, area: value });
      dispatch({ type: "GO_TO_STEP", step: next });
    },
    [dispatch, state.answers],
  );

  const keyboardOptions = OPTIONS.map((opt, i) => ({
    key: String(i + 1),
    action: () => handleSelect(opt),
  }));

  useQuizKeyboard({
    onEnter: () => {},
    options: keyboardOptions,
  });

  return (
    <QuizScreenLayout title="Qual é a sua área de atuação?">
      {/* Warning */}
      <div className="w-full max-w-lg mb-6 rounded-xl border border-amber-500/20 bg-amber-500/5 px-5 py-4 text-amber-300/90 text-sm font-body leading-relaxed">
        ⚠️ Atenção: a NSM atende exclusivamente clínicas médicas, odontológicas
        e de estética. Não aceitamos outros tipos de negócios.
      </div>

      <div className="flex flex-col gap-3 w-full">
        {OPTIONS.map((option, i) => (
          <QuizOptionButton
            key={option}
            label={option}
            shortcutKey={SHORTCUT_LABELS[i]}
            selected={state.answers.area === option}
            onClick={() => handleSelect(option)}
          />
        ))}
      </div>
    </QuizScreenLayout>
  );
}

export default S02IcpFilter;
