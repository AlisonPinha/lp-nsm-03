export type StepId =
  | "opening"
  | "icp-filter"
  | "structure"
  | "secretary"
  | "revenue"
  | "ad-spend"
  | "urgency"
  | "marketing-exp"
  | "willingness"
  | "name"
  | "phone"
  | "email"
  | "instagram"
  | "situation"
  | "contact-pref"
  | "social-proof"
  | "confirmation"
  | "dq-a"
  | "dq-b"
  | "dq-c"
  | "dq-d";

export interface QuizAnswers {
  area: string;
  hasClinic: string;
  hasSecretary: string;
  revenue: string;
  adSpend: string;
  urgency: string;
  marketingExp: string;
  willingness: string;
  name: string;
  phone: string;
  email: string;
  instagram: string;
  situation: string;
  contactPref: string;
}

export const INITIAL_ANSWERS: QuizAnswers = {
  area: "",
  hasClinic: "",
  hasSecretary: "",
  revenue: "",
  adSpend: "",
  urgency: "",
  marketingExp: "",
  willingness: "",
  name: "",
  phone: "",
  email: "",
  instagram: "",
  situation: "",
  contactPref: "",
};

export interface QuizState {
  currentStep: StepId;
  answers: QuizAnswers;
  history: StepId[];
  submitted: boolean;
}

export type QuizAction =
  | { type: "SET_ANSWER"; field: keyof QuizAnswers; value: string }
  | { type: "GO_TO_STEP"; step: StepId }
  | { type: "GO_BACK" }
  | { type: "MARK_SUBMITTED" }
  | { type: "RESET" };
