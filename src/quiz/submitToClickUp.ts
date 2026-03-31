import type { QuizAnswers } from "./quizTypes";
import { getVisitorId } from "@/lib/tracking";
import { trackPixel } from "@/lib/meta-pixel";

const API_BASE = import.meta.env.PROD
  ? "https://api.nutraseumarketing.com.br"
  : "http://localhost:3000";

export async function submitToClickUp(answers: QuizAnswers): Promise<void> {
  const payload = {
    source: "lp-03",
    answers: {
      name: answers.name,
      phone: answers.phone,
      email: answers.email,
      instagram: answers.instagram || undefined,
      area: answers.area,
      revenue: answers.revenue,
      urgency: answers.urgency,
      hasClinic: answers.hasClinic,
      hasSecretary: answers.hasSecretary,
      adSpend: answers.adSpend,
      marketingExp: answers.marketingExp,
      willingness: answers.willingness,
      situation: answers.situation || undefined,
      contactPref: answers.contactPref,
    },
    utm: getStoredUTMs(),
    sessionId: crypto.randomUUID?.() ?? fallbackUUID(),
    visitor_id: getVisitorId() ?? undefined,
    metadata: {
      userAgent: navigator.userAgent,
      referrer: document.referrer || undefined,
      landingUrl: window.location.href,
      stepsCompleted: 16,
    },
  };

  const response = await fetch(`${API_BASE}/api/webhook/quiz-lp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-quiz-secret": "764e4e2e22024faf00ce787ade2a9729",
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || `HTTP ${response.status}`);
  }

  // Fire Meta Pixel Lead event
  trackPixel('Lead', {
    content_name: answers.area,
    content_category: 'quiz_complete',
  });
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
  if (Object.keys(utm).length > 0) {
    try { sessionStorage.setItem("quiz-utm-lp-03", JSON.stringify(utm)); } catch { /* ignore */ }
  }
  return utm;
}

function fallbackUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}
