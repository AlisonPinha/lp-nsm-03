import type { StepId, QuizAnswers } from "./quizTypes";

const QUALIFYING_AREAS = [
  "Medicina (ortopedia, cirurgia plástica, dermatologia, etc.)",
  "Odontologia (lentes, implantes, ortodontia, Invisalign, etc.)",
  "Estética (harmonização facial, corporal, etc.)",
];

export function getNextStep(current: StepId, answers: QuizAnswers): StepId {
  switch (current) {
    case "opening":
      return "icp-filter";

    case "icp-filter":
      return QUALIFYING_AREAS.includes(answers.area) ? "structure" : "dq-a";

    case "structure":
      return answers.hasClinic === "Ainda não tenho clínica própria"
        ? "dq-b"
        : "secretary";

    case "secretary":
      return "revenue";

    case "revenue":
      return answers.revenue === "Ainda não faturo" ? "dq-c" : "ad-spend";

    case "ad-spend":
      return "urgency";

    case "urgency":
      return "marketing-exp";

    case "marketing-exp":
      return "willingness";

    case "willingness":
      return answers.willingness === "Não, estou apenas pesquisando"
        ? "dq-d"
        : "name";

    case "name":
      return "phone";

    case "phone":
      return "email";

    case "email":
      return "instagram";

    case "instagram":
      return "situation";

    case "situation":
      return "contact-pref";

    case "contact-pref":
      return "social-proof";

    case "social-proof":
      return "confirmation";

    default:
      return current;
  }
}

const PROGRESS_STEPS: StepId[] = [
  "opening",
  "icp-filter",
  "structure",
  "secretary",
  "revenue",
  "ad-spend",
  "urgency",
  "marketing-exp",
  "willingness",
  "name",
  "phone",
  "email",
  "instagram",
  "situation",
  "contact-pref",
  "social-proof",
  "confirmation",
];

export function getProgress(step: StepId): number {
  if (step.startsWith("dq-")) return 100;
  const index = PROGRESS_STEPS.indexOf(step);
  if (index === -1) return 0;
  return Math.round((index / (PROGRESS_STEPS.length - 1)) * 100);
}

export function isDqStep(step: StepId): boolean {
  return step.startsWith("dq-");
}
