import { useQuiz } from "../QuizProvider";
import { useQuizKeyboard } from "../useQuizKeyboard";
import { getNextStep } from "../quizConfig";
import QuizScreenLayout from "../QuizScreenLayout";
import QuizTextInput from "../QuizTextInput";

function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 2) return digits.length > 0 ? `(${digits}` : "";
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function S14Phone() {
  const { state, dispatch, goToStep } = useQuiz();
  const { answers } = state;

  const canContinue = answers.phone.replace(/\D/g, "").length >= 10;

  const handleChange = (val: string) => {
    const formatted = formatPhone(val);
    dispatch({ type: "SET_ANSWER", field: "phone", value: formatted });
  };

  const handleContinue = () => {
    if (!canContinue) return;
    goToStep(getNextStep("phone", answers));
  };

  useQuizKeyboard({
    onEnter: handleContinue,
  });

  return (
    <QuizScreenLayout
      title="Qual o melhor telefone para entrarmos em contato?"
      showContinue
      continueDisabled={!canContinue}
      onContinue={handleContinue}
    >
      <QuizTextInput
        label="WhatsApp com DDD"
        placeholder="(11) 99999-9999"
        type="tel"
        value={answers.phone}
        onChange={handleChange}
        maxLength={15}
      />
    </QuizScreenLayout>
  );
}

export default S14Phone;
