import { getVisitorId, getMetaTrackingContext } from "@/lib/tracking";

export interface PopupAnswers {
  name: string;
  phone: string;
  instagram: string;
  clinicName: string;
  segment: string;
  revenue: string;
}

export interface SubmitResult {
  leadEventId: string;
}

const API_BASE = import.meta.env.PROD
  ? "https://api.nutraseumarketing.com.br"
  : "http://localhost:3000";

const QUIZ_SECRET = import.meta.env.VITE_QUIZ_SECRET || "";

const MAX_RETRIES = 2;

export async function submitPopup(answers: PopupAnswers): Promise<SubmitResult> {
  // eventID p/ deduplicação Pixel ↔ CAPI (backend usa em sendMetaCAPIEvent
  // e o front em fbq('track', 'Lead', ..., {eventID})).
  const leadEventId = `lead_${Date.now()}_${
    crypto.randomUUID?.().slice(0, 8) ?? Math.random().toString(36).slice(2, 10)
  }`;

  const payload = {
    source: "lp-03",
    answers: {
      name: answers.name,
      phone: answers.phone,
      instagram: answers.instagram,
      clinicName: answers.clinicName,
      segment: answers.segment,
      revenue: answers.revenue,
    },
    utm: getStoredUTMs(),
    sessionId: crypto.randomUUID?.() ?? fallbackUUID(),
    visitor_id: getVisitorId() ?? undefined,
    metaContext: getMetaTrackingContext(),
    metadata: {
      userAgent: navigator.userAgent,
      referrer: document.referrer || undefined,
      landingUrl: window.location.href,
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
        return { leadEventId };
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
    const stored = sessionStorage.getItem("popup-utm-lp-03");
    if (stored) return JSON.parse(stored);
  } catch {
    /* ignore */
  }

  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]) {
    const val = params.get(key);
    if (val) utm[key] = val;
  }
  if (Object.keys(utm).length > 0) {
    try {
      sessionStorage.setItem("popup-utm-lp-03", JSON.stringify(utm));
    } catch {
      /* ignore */
    }
  }
  return utm;
}

function fallbackUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}
