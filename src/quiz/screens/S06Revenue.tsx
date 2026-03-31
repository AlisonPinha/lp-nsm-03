import { useCallback } from "react";
import { useQuiz } from "../QuizProvider";
import QuizScreenLayout from "../QuizScreenLayout";
import QuizOptionButton from "../QuizOptionButton";
import { useQuizKeyboard } from "../useQuizKeyboard";
import { getNextStep } from "../quizConfig";

const OPTIONS = [
  "Ainda não faturo",
  "Entre R$15 e R$30 mil por mês",
  "Entre R$30 e R$50 mil por mês",
  "Entre R$50 e R$100 mil por mês",
  "Entre R$100 e R$200 mil por mês",
  "Mais de R$200 mil por mês",
] as const;

const SHORTCUT_LABELS = ["A", "B", "C", "D", "E", "F"];

export function S06Revenue() {
  const { state, dispatch } = useQuiz();

  const handleSelect = useCallback(
    (value: string) => {
      dispatch({ type: "SET_ANSWER", field: "revenue", value });
      const next = getNextStep("revenue", {
        ...state.answers,
        revenue: value,
      });
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
    <QuizScreenLayout title="Qual foi a média do seu faturamento no último mês?">
      <div className="flex flex-col gap-3 w-full">
        {OPTIONS.map((option, i) => (
          <QuizOptionButton
            key={option}
            label={option}
            shortcutKey={SHORTCUT_LABELS[i]}
            selected={state.answers.revenue === option}
            onClick={() => handleSelect(option)}
          />
        ))}
      </div>
    </QuizScreenLayout>
  );
}

export default S06Revenue;
