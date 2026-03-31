import { useCallback } from "react";
import { useQuiz } from "../QuizProvider";
import QuizScreenLayout from "../QuizScreenLayout";
import QuizOptionButton from "../QuizOptionButton";
import { useQuizKeyboard } from "../useQuizKeyboard";
import { getNextStep } from "../quizConfig";

const OPTIONS = [
  "Sim, estou pronto(a) para investir e crescer",
  "Talvez, preciso entender melhor",
  "Não, estou apenas pesquisando",
] as const;

const SHORTCUT_LABELS = ["A", "B", "C"];

export function S11Willingness() {
  const { state, dispatch } = useQuiz();

  const handleSelect = useCallback(
    (value: string) => {
      dispatch({ type: "SET_ANSWER", field: "willingness", value });
      const next = getNextStep("willingness", {
        ...state.answers,
        willingness: value,
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
    <QuizScreenLayout title="Se fizer sentido, você tá pronto(a) pra investir e ver resultado nos próximos 60 dias?">
      <div className="flex flex-col gap-3 w-full">
        {OPTIONS.map((option, i) => (
          <QuizOptionButton
            key={option}
            label={option}
            shortcutKey={SHORTCUT_LABELS[i]}
            selected={state.answers.willingness === option}
            onClick={() => handleSelect(option)}
          />
        ))}
      </div>
    </QuizScreenLayout>
  );
}

export default S11Willingness;
