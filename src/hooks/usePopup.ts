import { createContext, useContext, useState, type ReactNode } from "react";
import React from "react";

interface PopupContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const PopupContext = createContext<PopupContextValue | null>(null);

export function PopupProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => {
    // Todo CTA da LP abre o popup: clique e abertura com os nomes padronizados
    // (GA4, Pixel e tracking-api pelo /nsm-origem.js). Lead só no envio (Popup.tsx).
    window.nsmOrigem?.evento("cta_click", { source: "lp-03" });
    window.nsmOrigem?.evento("open_lead_modal", { source: "lp-03" });
    setIsOpen(true);
  };
  const close = () => setIsOpen(false);

  return React.createElement(
    PopupContext.Provider,
    { value: { isOpen, open, close } },
    children,
  );
}

export function usePopup(): PopupContextValue {
  const context = useContext(PopupContext);
  if (!context) {
    throw new Error("usePopup must be used within a PopupProvider");
  }
  return context;
}
