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
}
