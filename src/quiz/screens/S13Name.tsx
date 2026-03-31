import { useQuiz } from "../QuizProvider";
import { useQuizKeyboard } from "../useQuizKeyboard";
import { getNextStep } from "../quizConfig";
import QuizScreenLayout from "../QuizScreenLayout";
import QuizTextInput from "../QuizTextInput";

export function S13Name() {
  const { state, dispatch, goToStep } = useQuiz();
  const { answers } = state;

  const canContinue = answers.name.trim().length > 0;

  const handleContinue = () => {
    if (!canContinue) return;
    dispatch({ type: "SET_ANSWER", field: "name", value: answers.name });
    goToStep(getNextStep("name", answers));
  };

  useQuizKeyboard({
    onEnter: handleContinue,
  });

  return (
    <QuizScreenLayout
      title="Qual é seu nome?"
      showContinue
      continueDisabled={!canContinue}
      onContinue={handleContinue}
    >
      <QuizTextInput
        label="Seu nome completo"
        placeholder="Digite seu nome"
        value={answers.name}
        onChange={(val) => dispatch({ type: "SET_ANSWER", field: "name", value: val })}
      />
    </QuizScreenLayout>
  );
}

export default S13Name;
