import { useQuiz } from "../QuizProvider";
import { useQuizKeyboard } from "../useQuizKeyboard";
import { getNextStep } from "../quizConfig";
import QuizScreenLayout from "../QuizScreenLayout";
import QuizTextInput from "../QuizTextInput";

function isValidEmail(email: string): boolean {
  return email.includes("@") && email.includes(".");
}

export function S15Email() {
  const { state, dispatch, goToStep } = useQuiz();
  const { answers } = state;

  const canContinue =
    answers.email.trim().length > 0 && isValidEmail(answers.email);

  const handleContinue = () => {
    if (!canContinue) return;
    goToStep(getNextStep("email", answers));
  };

  useQuizKeyboard({
    onEnter: handleContinue,
  });

  return (
    <QuizScreenLayout
      title="Qual seu melhor email?"
      subtitle="Fique tranquilo, também odiamos spam."
      showContinue
      continueDisabled={!canContinue}
      onContinue={handleContinue}
    >
      <QuizTextInput
        label="E-mail profissional"
        placeholder="seu@email.com"
        type="email"
        value={answers.email}
        onChange={(val) =>
          dispatch({ type: "SET_ANSWER", field: "email", value: val })
        }
      />
    </QuizScreenLayout>
  );
}

export default S15Email;
