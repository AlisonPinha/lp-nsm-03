import { createContext, useContext, useState, type ReactNode } from "react";
import React from "react";
import { trackPixel } from "@/lib/meta-pixel";

interface PopupContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const PopupContext = createContext<PopupContextValue | null>(null);

export function PopupProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => {
    // Abertura do popup é engajamento (ViewContent), não conversão.
    // Lead só é disparado no submit bem-sucedido (submitPopup).
    trackPixel("ViewContent", {
      content_name: "popup_open",
      content_category: "lead_form",
      source: "lp-03",
    });
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
