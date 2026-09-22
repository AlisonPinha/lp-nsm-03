/**
 * NSM Tracking SDK: self-contained module for LP-03.
 * Sends page_view, scroll_depth, time_on_page, and conversion events
 * to the tracking-api at tracking-api.nsmvps.com.br.
 */

// ── Config ──────────────────────────────────────────────────────

import { firePageView } from './meta-pixel';

const TRACKING_URL = 'https://tracking-api.nsmvps.com.br';
const SITE_ID = '3a0600ce-791b-4de2-a6b5-52305af272ef';
const API_KEY = 'trk_cb7c80ea29976009779aeedd37aa9cd77ccc65aa1b4a9d9bd05a5e6b6a2decdc';
const COOKIE_NAME = '_trk';
const COOKIE_MAX_AGE_DAYS = 400;
const LP_NAME = 'lp-03';
const DEBUG = false;

const CAPI_URL = import.meta.env.PROD
  ? 'https://api.nutraseumarketing.com.br/api/webhook/tracking-pageview'
  : 'http://localhost:3000/api/webhook/tracking-pageview';

// ── Types ───────────────────────────────────────────────────────

interface TrackingData {
  vid: string;
  ts: number;
  gclid?: string;
  fbclid?: string;
  fbc?: string;
  fbp?: string;
}

interface ClickIDs {
  gclid?: string;
  fbclid?: string;
  fbc?: string;
}

// ── Cookie ──────────────────────────────────────────────────────

function readCookie(): TrackingData | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
  if (!match) return null;
  try {
    return JSON.parse(atob(decodeURIComponent(match[1])));
  } catch {
    return null;
  }
}

function writeCookie(data: TrackingData): void {
  const value = encodeURIComponent(btoa(JSON.stringify(data)));
  const maxAge = COOKIE_MAX_AGE_DAYS * 86400;
  document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

// ── Click IDs ───────────────────────────────────────────────────
// A UTM (primeiro e último toque) é capturada só pelo /nsm-origem.js do domínio.

function extractClickIDs(): ClickIDs {
  const params = new URLSearchParams(window.location.search);
  const gclid = params.get('gclid') ?? undefined;
  const fbclid = params.get('fbclid') ?? undefined;
  const fbc = fbclid ? `fb.1.${Date.now()}.${fbclid}` : undefined;
  return { gclid, fbclid, fbc };
}

// fbp e fbc de verdade são os cookies do Pixel (_fbp, _fbc), lidos na hora do
// envio. O SDK fabricava um fbp próprio, que não casava com nada na Meta. Sem o
// cookie (Pixel bloqueado ou ainda carregando), fbp não vai; fbc cai no montado
// a partir do fbclid, formato aceito pela Meta.
function pixelCookie(name: '_fbp' | '_fbc'): string | undefined {
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : undefined;
}

function metaIds(data: TrackingData): { fbp?: string; fbc?: string } {
  return { fbp: pixelCookie('_fbp'), fbc: pixelCookie('_fbc') ?? data.fbc };
}

// ── Helpers ─────────────────────────────────────────────────────

function generateUUID(): string {
  if (crypto.randomUUID) return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function generateEventId(): string {
  return `evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// ── Event Sending ───────────────────────────────────────────────

function buildPayload(event: string, data: TrackingData, properties?: Record<string, unknown>) {
  const u = window.nsmOrigem?.get().ultimo;
  return {
    event_id: generateEventId(),
    event,
    visitor_id: data.vid,
    url: window.location.href,
    referrer: document.referrer || undefined,
    page_title: document.title || undefined,
    utm: u ? {
      source: u.source,
      medium: u.medium,
      campaign: u.campaign,
      term: u.term,
      content: u.content,
      utm_id: u.id,
    } : undefined,
    click_ids: {
      gclid: data.gclid,
      fbclid: data.fbclid,
      ...metaIds(data),
    },
    properties: { ...properties, lp_name: LP_NAME },
    timestamp: Date.now(),
    user_agent: navigator.userAgent,
  };
}

async function sendEvent(event: string, data: TrackingData, properties?: Record<string, unknown>): Promise<boolean> {
  const payload = buildPayload(event, data, properties);
  const body = JSON.stringify(payload);
  const url = `${TRACKING_URL}/api/v1/events`;

  try {
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Site-ID': SITE_ID,
        'X-API-Key': API_KEY,
      },
      body,
      keepalive: true,
    });
    if (DEBUG) console.log('[trk] Event sent:', event);
    return true;
  } catch {
    try {
      const blob = new Blob([body], { type: 'application/json' });
      navigator.sendBeacon(url, blob);
      if (DEBUG) console.log('[trk] Event sent via beacon:', event);
      return true;
    } catch {
      if (DEBUG) console.error('[trk] Failed to send event');
      return false;
    }
  }
}

// ── Scroll Depth Observer ───────────────────────────────────────

const SCROLL_MILESTONES = [25, 50, 75, 100];

function observeScrollDepth(data: TrackingData): () => void {
  let reachedIndex = -1;

  function onScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const percent = Math.min(Math.round((scrollTop / docHeight) * 100), 100);

    for (let i = reachedIndex + 1; i < SCROLL_MILESTONES.length; i++) {
      if (percent >= SCROLL_MILESTONES[i]) {
        reachedIndex = i;
        sendEvent('scroll_depth', data, { depth: SCROLL_MILESTONES[i] });
      }
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  return () => window.removeEventListener('scroll', onScroll);
}

// ── Time on Page Observer ───────────────────────────────────────

const TIME_MILESTONES = [30, 60, 120, 300];

function observeTimeOnPage(data: TrackingData): () => void {
  let elapsed = 0;
  let milestoneIndex = 0;

  const interval = setInterval(() => {
    if (document.hidden) return;
    if (milestoneIndex >= TIME_MILESTONES.length) {
      clearInterval(interval);
      return;
    }
    elapsed += 1;
    if (elapsed >= TIME_MILESTONES[milestoneIndex]) {
      sendEvent('time_on_page', data, { seconds: TIME_MILESTONES[milestoneIndex] });
      milestoneIndex++;
    }
  }, 1000);

  return () => clearInterval(interval);
}

// ── Public API ──────────────────────────────────────────────────

let _data: TrackingData | null = null;
let _cleanupScroll: (() => void) | null = null;
let _cleanupTime: (() => void) | null = null;

export function initTracking(): void {
  _data = readCookie();

  if (!_data) {
    const clickIds = extractClickIDs();

    _data = {
      vid: generateUUID(),
      ts: Date.now(),
      gclid: clickIds.gclid,
      fbclid: clickIds.fbclid,
      fbc: clickIds.fbc,
    };
    writeCookie(_data);
  } else {
    let updated = false;
    const clickIds = extractClickIDs();
    if (clickIds.gclid) { _data.gclid = clickIds.gclid; updated = true; }
    if (clickIds.fbclid) { _data.fbclid = clickIds.fbclid; _data.fbc = clickIds.fbc; updated = true; }

    if (updated) writeCookie(_data);
  }

  // A visita (page_view) na tracking-api sai do /nsm-origem.js, igual em todas as páginas.

  // Meta Pixel PageView (browser) + espelha no CAPI server-side com mesmo event_id.
  // Dedup automático no Events Manager.
  const pvEventId = `pv_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const am = firePageView(pvEventId, _data.vid);
  void sendPageViewToCAPI(pvEventId, _data, am);

  _cleanupScroll = observeScrollDepth(_data);
  _cleanupTime = observeTimeOnPage(_data);
}

async function sendPageViewToCAPI(
  eventId: string,
  data: TrackingData,
  am: Record<string, string>,
): Promise<void> {
  const body = JSON.stringify({
    event_id: eventId,
    source: LP_NAME,
    url: window.location.href,
    user_agent: navigator.userAgent,
    ...metaIds(data),
    external_id: data.vid,
    am,
  });

  try {
    await fetch(CAPI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    });
    if (DEBUG) console.log('[trk] PageView CAPI sent', { eventId });
  } catch {
    // fail-silent: Pixel browser já disparou, perda só do espelho server-side
  }
}

export function trackConversion(event: string, properties?: Record<string, unknown>): void {
  if (!_data) return;
  sendEvent(event, _data, properties);
}

export function getVisitorId(): string | null {
  return _data?.vid ?? null;
}

export function getMetaTrackingContext(): {
  visitor_id?: string;
  fbp?: string;
  fbc?: string;
} {
  if (!_data) return {};
  return { visitor_id: _data.vid, ...metaIds(_data) };
}

export function destroyTracking(): void {
  _cleanupScroll?.();
  _cleanupTime?.();
}
