/**
 * Meta Pixel helper — centraliza todas as chamadas fbq().
 * Standard events usam 'track', custom events usam 'trackCustom'.
 *
 * Suporta `eventID` opcional para deduplicação Pixel ↔ CAPI server.
 * Ver: https://developers.facebook.com/docs/meta-pixel/advanced/server-event-deduplication
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
