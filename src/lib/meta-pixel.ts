/**
 * Meta Pixel helper — centraliza todas as chamadas fbq().
 * Standard events usam 'track', custom events usam 'trackCustom'.
 *
 * Suporta `eventID` opcional para deduplicação Pixel ↔ CAPI server.
 * Ver: https://developers.facebook.com/docs/meta-pixel/advanced/server-event-deduplication
 */

const PIXEL_ID = "1180918229536856";

const STANDARD_EVENTS = new Set([
  "PageView",
  "Lead",
  "Schedule",
  "CompleteRegistration",
  "ViewContent",
  "Search",
  "AddToCart",
  "Purchase",
  "Subscribe",
  "Contact",
]);

export function trackPixel(
  event: string,
  params?: Record<string, unknown>,
  eventID?: string,
): void {
  if (typeof window.fbq !== "function") return;

  const opts = eventID ? { eventID } : undefined;

  if (STANDARD_EVENTS.has(event)) {
    window.fbq("track", event, params, opts);
  } else {
    window.fbq("trackCustom", event, params, opts);
  }
}

// ── Advanced Matching ───────────────────────────────────────────
// Re-inicializa o Pixel com PII hasheada (SHA-256). Sobe Match Quality
// porque a Meta correlaciona com usuários conhecidos via email/phone.
// Ver: https://developers.facebook.com/docs/meta-pixel/advanced/advanced-matching

async function sha256(value: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function normEmail(v: string): string {
  return v.trim().toLowerCase();
}

function normPhone(v: string): string {
  // Meta espera só dígitos com código de país. BR: garantir prefixo 55.
  const digits = v.replace(/\D/g, "");
  if (!digits) return "";
  return digits.startsWith("55") ? digits : `55${digits}`;
}

function normName(v: string): string {
  // lowercase + remove acentos + só letras
  return v
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z]/g, "");
}

export interface AdvancedMatchingUser {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
}

export async function setAdvancedMatching(user: AdvancedMatchingUser): Promise<void> {
  if (typeof window.fbq !== "function") return;
  if (typeof crypto?.subtle?.digest !== "function") return;

  try {
    const params: Record<string, string> = {};
    if (user.email) params.em = await sha256(normEmail(user.email));
    if (user.phone) {
      const ph = normPhone(user.phone);
      if (ph) params.ph = await sha256(ph);
    }
    if (user.firstName) {
      const fn = normName(user.firstName);
      if (fn) params.fn = await sha256(fn);
    }
    if (user.lastName) {
      const ln = normName(user.lastName);
      if (ln) params.ln = await sha256(ln);
    }
    if (Object.keys(params).length === 0) return;

    // Re-init injeta user_data nos próximos eventos (não dispara PageView novo)
    window.fbq("init", PIXEL_ID, params);
  } catch {
    // Hash falhou — segue sem advanced matching. Lead Pixel ainda dispara.
  }
}
