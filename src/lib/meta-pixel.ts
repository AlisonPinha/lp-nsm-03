/**
 * Meta Pixel helper — centraliza todas as chamadas fbq().
 * Standard events usam 'track', custom events usam 'trackCustom'.
 */

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

export function trackPixel(event: string, params?: Record<string, unknown>): void {
  if (typeof window.fbq !== "function") return;

  if (STANDARD_EVENTS.has(event)) {
    window.fbq("track", event, params);
  } else {
    window.fbq("trackCustom", event, params);
  }
}
