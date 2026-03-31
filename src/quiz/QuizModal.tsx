import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useQuizModal } from "@/hooks/useQuizModal";
import { QuizProvider, useQuiz } from "./QuizProvider";
import QuizProgress from "./QuizProgress";
import type { StepId } from "./quizTypes";

/* ---------- Screen imports ---------- */
import { S01Opening } from "./screens/S01Opening";
import { S02IcpFilter } from "./screens/S02IcpFilter";
import { S03Structure } from "./screens/S03Structure";
import { S04Secretary } from "./screens/S04Secretary";
import { S06Revenue } from "./screens/S06Revenue";
import { S07AdSpend } from "./screens/S07AdSpend";
import { S09Urgency } from "./screens/S09Urgency";
import { S10MarketingExp } from "./screens/S10MarketingExp";
import { S11Willingness } from "./screens/S11Willingness";
import { S13Name } from "./screens/S13Name";
import { S14Phone } from "./screens/S14Phone";
import { S15Email } from "./screens/S15Email";
import { S16Instagram } from "./screens/S16Instagram";
import { S17Situation } from "./screens/S17Situation";
import { S18ContactPref } from "./screens/S18ContactPref";
import { S19SocialProof } from "./screens/S19SocialProof";
import { S20Confirmation } from "./screens/S20Confirmation";
import DisqualificationScreen from "./DisqualificationScreen";

/* ---------- Screen switcher ---------- */

const SCREEN_MAP: Record<string, React.FC<{ variant?: string }>> = {
  "opening": S01Opening,
  "icp-filter": S02IcpFilter,
  "structure": S03Structure,
  "secretary": S04Secretary,
  "revenue": S06Revenue,
  "ad-spend": S07AdSpend,
  "urgency": S09Urgency,
  "marketing-exp": S10MarketingExp,
  "willingness": S11Willingness,
  "name": S13Name,
  "phone": S14Phone,
  "email": S15Email,
  "instagram": S16Instagram,
  "situation": S17Situation,
  "contact-pref": S18ContactPref,
  "social-proof": S19SocialProof,
  "confirmation": S20Confirmation,
};

const DQ_VARIANTS = new Set<StepId>(["dq-a", "dq-b", "dq-c", "dq-d"]);
const STEPS_WITHOUT_PROGRESS = new Set<StepId>(["opening", "confirmation"]);

function ScreenSwitcher() {
  const { state } = useQuiz();
  const { currentStep } = state;

  const isDq = DQ_VARIANTS.has(currentStep);
  const showProgress = !STEPS_WITHOUT_PROGRESS.has(currentStep) && !isDq;

  return (
    <>
      {showProgress && <QuizProgress />}

      <div className="quiz-fade-in">
        {isDq ? (
          <DisqualificationScreen variant={currentStep as "dq-a" | "dq-b" | "dq-c" | "dq-d"} />
        ) : (
          (() => {
            const Screen = SCREEN_MAP[currentStep];
            return Screen ? <Screen /> : null;
          })()
        )}
      </div>
    </>
  );
}

/* ---------- Modal shell ---------- */

function QuizModalContent() {
  const { isOpen, close } = useQuizModal();

  /* Lock body scroll when modal is open */
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const portalRoot = document.getElementById("quiz-root");
  if (!portalRoot) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] bg-nsm-dark-1 flex flex-col items-center justify-center overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <QuizProvider>
        <ScreenSwitcher />
      </QuizProvider>
    </div>,
    portalRoot
  );
}

export function QuizModal() {
  return <QuizModalContent />;
}
