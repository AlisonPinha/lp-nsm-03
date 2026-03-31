/**
 * NSM Tracking SDK — self-contained module for LP-03.
 * Sends page_view, scroll_depth, time_on_page, and conversion events
 * to the tracking-api at tracking-api.nsmvps.com.br.
 */

// ── Config ──────────────────────────────────────────────────────

const TRACKING_URL = 'https://tracking-api.nsmvps.com.br';
const SITE_ID = '3a0600ce-791b-4de2-a6b5-52305af272ef';
const API_KEY = 'trk_cb7c80ea29976009779aeedd37aa9cd77ccc65aa1b4a9d9bd05a5e6b6a2decdc';
const COOKIE_NAME = '_trk';
const COOKIE_MAX_AGE_DAYS = 400;
const LP_NAME = 'lp-03';
const DEBUG = false;

// ── Types ───────────────────────────────────────────────────────

interface TrackingData {
  vid: string;
  ts: number;
  fts?: string;
  ftm?: string;
  ftc?: string;
  lts?: string;
  ltm?: string;
  ltc?: string;
  ltt?: string;
  ltcn?: string;
  gclid?: string;
  fbclid?: string;
  fbc?: string;
  fbp?: string;
}

interface UTMData {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
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

// ── UTM & Click IDs ─────────────────────────────────────────────

function extractUTMs(): UTMData {
  const params = new URLSearchParams(window.location.search);
  return {
    source: params.get('utm_source') ?? undefined,
    medium: params.get('utm_medium') ?? undefined,
    campaign: params.get('utm_campaign') ?? undefined,
    term: params.get('utm_term') ?? undefined,
    content: params.get('utm_content') ?? undefined,
  };
}

function hasUTMs(utm: UTMData): boolean {
  return !!(utm.source || utm.medium || utm.campaign);
}

function extractClickIDs(): ClickIDs {
  const params = new URLSearchParams(window.location.search);
  const gclid = params.get('gclid') ?? undefined;
  const fbclid = params.get('fbclid') ?? undefined;
  const fbc = fbclid ? `fb.1.${Date.now()}.${fbclid}` : undefined;
  return { gclid, fbclid, fbc };
}

function generateFbp(): string {
  const random = Math.floor(Math.random() * 10_000_000_000).toString().padStart(10, '0');
  return `fb.1.${Date.now()}.${random}`;
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
  return {
    event_id: generateEventId(),
    event,
    visitor_id: data.vid,
    url: window.location.href,
    referrer: document.referrer || undefined,
    page_title: document.title || undefined,
    utm: data.lts ? {
      source: data.lts,
      medium: data.ltm,
      campaign: data.ltc,
      term: data.ltt,
      content: data.ltcn,
    } : undefined,
    click_ids: {
      gclid: data.gclid,
      fbclid: data.fbclid,
      fbc: data.fbc,
      fbp: data.fbp,
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
    const utms = extractUTMs();
    const clickIds = extractClickIDs();

    _data = {
      vid: generateUUID(),
      ts: Date.now(),
      fbp: generateFbp(),
      fts: utms.source,
      ftm: utms.medium,
      ftc: utms.campaign,
      lts: utms.source,
      ltm: utms.medium,
      ltc: utms.campaign,
      ltt: utms.term,
      ltcn: utms.content,
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
    if (!_data.fbp) { _data.fbp = generateFbp(); updated = true; }

    const utms = extractUTMs();
    if (hasUTMs(utms)) {
      _data.lts = utms.source;
      _data.ltm = utms.medium;
      _data.ltc = utms.campaign;
      _data.ltt = utms.term;
      _data.ltcn = utms.content;
      updated = true;
    }

    if (updated) writeCookie(_data);
  }

  sendEvent('page_view', _data);
  _cleanupScroll = observeScrollDepth(_data);
  _cleanupTime = observeTimeOnPage(_data);
}

export function trackConversion(event: string, properties?: Record<string, unknown>): void {
  if (!_data) return;
  sendEvent(event, _data, properties);
}

export function getVisitorId(): string | null {
  return _data?.vid ?? null;
}

export function destroyTracking(): void {
  _cleanupScroll?.();
  _cleanupTime?.();
}
