import { useCallback } from "react";
import { useQuiz } from "../QuizProvider";
import QuizScreenLayout from "../QuizScreenLayout";
import QuizOptionButton from "../QuizOptionButton";
import { useQuizKeyboard } from "../useQuizKeyboard";
import { getNextStep } from "../quizConfig";

const OPTIONS = [
  "Sim, já contratei e não tive resultado",
  "Sim, já contratei e tive algum resultado",
  "Nunca contratei",
] as const;

const SHORTCUT_LABELS = ["A", "B", "C"];

export function S10MarketingExp() {
  const { state, dispatch } = useQuiz();

  const handleSelect = useCallback(
    (value: string) => {
      dispatch({ type: "SET_ANSWER", field: "marketingExp", value });
      const next = getNextStep("marketing-exp", {
        ...state.answers,
        marketingExp: value,
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
    <QuizScreenLayout title="Você já investiu em marketing digital ou contratou alguma agência antes?">
      <div className="flex flex-col gap-3 w-full">
        {OPTIONS.map((option, i) => (
          <QuizOptionButton
            key={option}
            label={option}
            shortcutKey={SHORTCUT_LABELS[i]}
            selected={state.answers.marketingExp === option}
            onClick={() => handleSelect(option)}
          />
        ))}
      </div>
    </QuizScreenLayout>
  );
}

export default S10MarketingExp;
