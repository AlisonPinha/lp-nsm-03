/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CLICKUP_API_KEY: string;
  readonly VITE_CLICKUP_LIST_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  fbq?: (...args: unknown[]) => void;
  gtag?: (...args: unknown[]) => void;
  /** /nsm-origem.js do gateway: origem do visitante e eventos padronizados. */
  nsmOrigem?: {
    get(): { primeiro: NsmToque | null; ultimo: NsmToque | null };
    visitante(): string | undefined;
    evento(nome: "cta_click" | "open_lead_modal", props?: Record<string, unknown>): void;
  };
}

interface NsmToque {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
  id?: string;
  fbclid?: string;
  gclid?: string;
  pagina?: string;
  em?: string;
}
