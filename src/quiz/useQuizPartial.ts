import { useRef } from "react";
import type { QuizAnswers, StepId } from "./quizTypes";
import { getVisitorId } from "@/lib/tracking";

const API_BASE = import.meta.env.PROD
  ? "https://api.nutraseumarketing.com.br"
  : "http://localhost:3000";

const PARTIAL_ENDPOINT = `${API_BASE}/api/quiz/partial`;

const SOURCE = "lp-03";

// Steps that trigger a partial send (when LEAVING this step)
const PARTIAL_TRIGGERS: Record<string, { step: number; status: string }> = {
  phone: { step: 1, status: "contact_captured" },
  email: { step: 2, status: "profile_captured" },
  instagram: { step: 3, status: "contact_complete" },
};

function normalizePhone(phone: string): string {
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) digits = digits.slice(1);
  if (!digits.startsWith("55") && digits.length <= 11) digits = "55" + digits;
  return digits;
}

function getStoredUTMs(): Record<string, string> {
  try {
    const stored = sessionStorage.getItem("quiz-utm-lp-03");
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]) {
    const val = params.get(key);
    if (val) utm[key] = val;
  }
  return utm;
}

export function useQuizPartial() {
  const lastStepSent = useRef(0);
  const sessionId = useRef(crypto.randomUUID?.() ?? fallbackUUID());

  function maybeSendPartial(leavingStep: StepId, answers: QuizAnswers) {
    const trigger = PARTIAL_TRIGGERS[leavingStep];
    if (!trigger) return;

    // Already sent this or a later step
    if (lastStepSent.current >= trigger.step) return;

    // Need at least name + phone
    if (!answers.name?.trim() || !answers.phone?.trim()) return;

    const phone = normalizePhone(answers.phone);
    if (phone.length < 12) return;

    const payload = {
      source: SOURCE,
      step: trigger.step,
      status: trigger.status,
      sessionId: sessionId.current,
      timestamp: new Date().toISOString(),
      answers: {
        name: answers.name.trim(),
        phone: phone,
        email: answers.email?.trim() || undefined,
        instagram: answers.instagram?.trim() || undefined,
        area: answers.area || undefined,
        revenue: answers.revenue || undefined,
        urgency: answers.urgency || undefined,
      },
      utm: getStoredUTMs(),
      visitor_id: getVisitorId() ?? undefined,
      metadata: {
        userAgent: navigator.userAgent,
        referrer: document.referrer || undefined,
      },
    };

    // Fire-and-forget
    fetch(PARTIAL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-quiz-secret": "764e4e2e22024faf00ce787ade2a9729",
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000),
    })
      .then((res) => {
        if (res.ok) lastStepSent.current = trigger.step;
      })
      .catch((err) => {
        console.warn(`[quiz-partial] Step ${trigger.step} failed:`, err.message);
      });
  }

  return { maybeSendPartial };
}

function fallbackUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}
