import type { QuizAnswers } from "./quizTypes";
import { getVisitorId, getMetaTrackingContext } from "@/lib/tracking";
import { trackPixel, setAdvancedMatching } from "@/lib/meta-pixel";

const API_BASE = import.meta.env.PROD
  ? "https://api.nutraseumarketing.com.br"
  : "http://localhost:3000";

const QUIZ_SECRET = import.meta.env.VITE_QUIZ_SECRET || "";

const MAX_RETRIES = 2;

export async function submitToClickUp(answers: QuizAnswers): Promise<void> {
  // Deduplicação Pixel ↔ CAPI: gerar eventId único, enviar no payload
  // (backend usa em sendMetaCAPIEvent) e no fbq('track', 'Lead', ..., {eventID})
  // pra Meta correlacionar os 2 eventos como um só.
  const leadEventId = `lead_${Date.now()}_${
    crypto.randomUUID?.().slice(0, 8) ?? Math.random().toString(36).slice(2, 10)
  }`;

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
    metaContext: getMetaTrackingContext(),
    metadata: {
      userAgent: navigator.userAgent,
      referrer: document.referrer || undefined,
      landingUrl: window.location.href,
      stepsCompleted: 16,
    },
    eventIds: { lead: leadEventId },
  };

  const fetchOptions: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-quiz-secret": QUIZ_SECRET,
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(15000),
  };

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(`${API_BASE}/api/webhook/quiz-lp`, fetchOptions);
      if (response.ok) {
        // Advanced Matching ANTES do Lead pra subir Match Quality.
        // setAdvancedMatching faz fbq('init', ..., {em, ph, fn, ln}) hasheados.
        const [firstName, ...rest] = answers.name.trim().split(/\s+/);
        await setAdvancedMatching({
          email: answers.email,
          phone: answers.phone,
          firstName,
          lastName: rest.join(" ") || undefined,
          externalId: getVisitorId() ?? undefined,
        });
        trackPixel('Lead', {
          content_name: answers.area,
          content_category: 'quiz_complete',
        }, leadEventId);
        return;
      }
      const data = await response.json().catch(() => ({}));
      lastError = new Error(data.error || `HTTP ${response.status}`);
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
    }

    if (attempt < MAX_RETRIES) {
      await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
    }
  }

  throw lastError ?? new Error("Falha ao enviar dados");
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
