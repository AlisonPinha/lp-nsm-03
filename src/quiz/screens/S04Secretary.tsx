import { useCallback } from "react";
import { useQuiz } from "../QuizProvider";
import QuizScreenLayout from "../QuizScreenLayout";
import QuizOptionButton from "../QuizOptionButton";
import { useQuizKeyboard } from "../useQuizKeyboard";
import { getNextStep } from "../quizConfig";

const OPTIONS = [
  "Sim, tenho secretária/recepcionista",
  "Não, eu mesmo faço o atendimento",
  "Estou em processo de contratação",
] as const;

const SHORTCUT_LABELS = ["A", "B", "C"];

export function S04Secretary() {
  const { state, dispatch } = useQuiz();

  const handleSelect = useCallback(
    (value: string) => {
      dispatch({ type: "SET_ANSWER", field: "hasSecretary", value });
      const next = getNextStep("secretary", {
        ...state.answers,
        hasSecretary: value,
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
    <QuizScreenLayout
      title="Você tem secretária ou recepcionista na sua clínica?"
    >
      <div className="flex flex-col gap-3 w-full">
        {OPTIONS.map((option, i) => (
          <QuizOptionButton
            key={option}
            label={option}
            shortcutKey={SHORTCUT_LABELS[i]}
            selected={state.answers.hasSecretary === option}
            onClick={() => handleSelect(option)}
          />
        ))}
      </div>
    </QuizScreenLayout>
  );
}

export default S04Secretary;
