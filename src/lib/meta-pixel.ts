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
  externalId?: string;
}

export type AdvancedMatchingHashes = Partial<Record<"em" | "ph" | "fn" | "ln", string>>;

const STORAGE_KEY = "nsm_am";
const HEX_64 = /^[a-f0-9]{64}$/i;

/**
 * Lê os hashes de AM persistidos no localStorage (set pelo último submit).
 * Permite usuários retornantes terem AM no PageView seguinte.
 */
export function getStoredAdvancedMatching(): AdvancedMatchingHashes {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const out: AdvancedMatchingHashes = {};
    for (const key of ["em", "ph", "fn", "ln"] as const) {
      const v = parsed?.[key];
      if (typeof v === "string" && HEX_64.test(v)) out[key] = v.toLowerCase();
    }
    return out;
  } catch {
    return {};
  }
}

function persistAdvancedMatching(hashes: AdvancedMatchingHashes): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(hashes));
  } catch {
    /* localStorage indisponível */
  }
}

export async function setAdvancedMatching(user: AdvancedMatchingUser): Promise<AdvancedMatchingHashes> {
  if (typeof window.fbq !== "function") return {};
  if (typeof crypto?.subtle?.digest !== "function") return {};

  const hashes: AdvancedMatchingHashes = {};
  try {
    if (user.email) hashes.em = await sha256(normEmail(user.email));
    if (user.phone) {
      const ph = normPhone(user.phone);
      if (ph) hashes.ph = await sha256(ph);
    }
    if (user.firstName) {
      const fn = normName(user.firstName);
      if (fn) hashes.fn = await sha256(fn);
    }
    if (user.lastName) {
      const ln = normName(user.lastName);
      if (ln) hashes.ln = await sha256(ln);
    }
  } catch {
    return {};
  }

  if (Object.keys(hashes).length === 0 && !user.externalId) return {};

  // Re-init injeta user_data nos próximos eventos (não dispara PageView novo)
  const initParams: Record<string, string> = { ...hashes };
  if (user.externalId) initParams.external_id = user.externalId;
  window.fbq("init", PIXEL_ID, initParams);

  // Persiste só hashes PII pro próximo PageView de retornantes
  if (Object.keys(hashes).length > 0) persistAdvancedMatching(hashes);

  return hashes;
}

/**
 * Dispara PageView com dedup CAPI. Aplica AM persistido (de retornante) +
 * external_id (vid do tracking SDK) antes do fbq track.
 */
export function firePageView(eventId: string, externalId?: string): AdvancedMatchingHashes {
  if (typeof window.fbq !== "function") return {};

  const stored = getStoredAdvancedMatching();
  const initParams: Record<string, string> = { ...stored };
  if (externalId) initParams.external_id = externalId;

  if (Object.keys(initParams).length > 0) {
    window.fbq("init", PIXEL_ID, initParams);
  }

  const opts = eventId ? { eventID: eventId } : undefined;
  window.fbq("track", "PageView", undefined, opts);

  return stored;
}
