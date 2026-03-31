import { useCallback } from "react";
import { useQuiz } from "../QuizProvider";
import QuizScreenLayout from "../QuizScreenLayout";
import QuizOptionButton from "../QuizOptionButton";
import { useQuizKeyboard } from "../useQuizKeyboard";
import { getNextStep } from "../quizConfig";

const OPTIONS = [
  "Sim, tenho clínica própria",
  "Atendo em clínica compartilhada / coworking",
  "Ainda não tenho clínica própria",
] as const;

const SHORTCUT_LABELS = ["A", "B", "C"];

export function S03Structure() {
  const { state, dispatch } = useQuiz();

  const handleSelect = useCallback(
    (value: string) => {
      dispatch({ type: "SET_ANSWER", field: "hasClinic", value });
      const next = getNextStep("structure", {
        ...state.answers,
        hasClinic: value,
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
      title="Você tem clínica própria?"
      subtitle="Para personalizar seu diagnóstico, precisamos entender sua estrutura atual."
    >
      <div className="flex flex-col gap-3 w-full">
        {OPTIONS.map((option, i) => (
          <QuizOptionButton
            key={option}
            label={option}
            shortcutKey={SHORTCUT_LABELS[i]}
            selected={state.answers.hasClinic === option}
            onClick={() => handleSelect(option)}
          />
        ))}
      </div>
    </QuizScreenLayout>
  );
}

export default S03Structure;
