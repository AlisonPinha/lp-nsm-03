import { useQuiz } from "../QuizProvider";
import { useQuizKeyboard } from "../useQuizKeyboard";
import { getNextStep } from "../quizConfig";
import QuizScreenLayout from "../QuizScreenLayout";
import QuizTextInput from "../QuizTextInput";

export function S16Instagram() {
  const { state, dispatch, goToStep } = useQuiz();
  const { answers } = state;

  const handleContinue = () => {
    goToStep(getNextStep("instagram", answers));
  };

  useQuizKeyboard({
    onEnter: handleContinue,
  });

  return (
    <QuizScreenLayout
      title="Qual o @ do seu Instagram?"
      subtitle="Para que nossos especialistas possam fazer uma análise do seu perfil. Por exemplo: @pedroactis.ads"
      showContinue
      continueDisabled={false}
      continueLabel={answers.instagram ? "Continuar" : "Pular"}
      onContinue={handleContinue}
    >
      <QuizTextInput
        label="@usuario"
        placeholder="@suaclinica"
        value={answers.instagram}
        onChange={(val) =>
          dispatch({ type: "SET_ANSWER", field: "instagram", value: val })
        }
      />
    </QuizScreenLayout>
  );
}

export default S16Instagram;
