import { createContext, useContext, useReducer, useCallback, type ReactNode } from "react";
import type { QuizState, QuizAction, QuizAnswers } from "./quizTypes";
import { INITIAL_ANSWERS } from "./quizTypes";
import { trackConversion } from "@/lib/tracking";
import { trackPixel } from "@/lib/meta-pixel";
import { useQuizPartial } from "./useQuizPartial";

const INITIAL_STATE: QuizState = {
  currentStep: "opening",
  answers: { ...INITIAL_ANSWERS },
  history: [],
  submitted: false,
};

function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case "SET_ANSWER":
      return {
        ...state,
        answers: {
          ...state.answers,
          [action.field]: action.value,
        },
      };

    case "GO_TO_STEP":
      return {
        ...state,
        currentStep: action.step,
        history: [...state.history, state.currentStep],
      };

    case "GO_BACK": {
      if (state.history.length === 0) return state;
      const previousStep = state.history[state.history.length - 1];
      return {
        ...state,
        currentStep: previousStep,
        history: state.history.slice(0, -1),
      };
    }

    case "MARK_SUBMITTED":
      return {
        ...state,
        submitted: true,
      };

    case "RESET":
      return { ...INITIAL_STATE, answers: { ...INITIAL_ANSWERS } };

    default:
      return state;
  }
}

interface QuizContextValue {
  state: QuizState;
  dispatch: React.Dispatch<QuizAction>;
  setAnswer: (field: keyof QuizAnswers, value: string) => void;
  goToStep: (step: QuizState["currentStep"]) => void;
  goBack: () => void;
  markSubmitted: () => void;
  reset: () => void;
}

const QuizContext = createContext<QuizContextValue | null>(null);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(quizReducer, INITIAL_STATE);
  const { maybeSendPartial } = useQuizPartial();

  const setAnswer = useCallback(
    (field: keyof QuizAnswers, value: string) =>
      dispatch({ type: "SET_ANSWER", field, value }),
    [],
  );

  const goToStep = useCallback(
    (step: QuizState["currentStep"]) => {
      const from = state.currentStep;
      maybeSendPartial(from, state.answers);
      dispatch({ type: "GO_TO_STEP", step });
      trackConversion('quiz_step', { from, to: step, step_number: state.history.length + 1 });
      trackPixel('QuizStep', { step_name: step, step_number: state.history.length + 1, from_step: from });
    },
    [state.currentStep, state.history.length, state.answers, maybeSendPartial],
  );

  const goBack = useCallback(() => dispatch({ type: "GO_BACK" }), []);

  const markSubmitted = useCallback(() => dispatch({ type: "MARK_SUBMITTED" }), []);

  const reset = useCallback(() => dispatch({ type: "RESET" }), []);

  return (
    <QuizContext.Provider
      value={{ state, dispatch, setAnswer, goToStep, goBack, markSubmitted, reset }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz(): QuizContextValue {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error("useQuiz must be used within a QuizProvider");
  }
  return context;
}
