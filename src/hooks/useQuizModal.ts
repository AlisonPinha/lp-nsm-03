import { createContext, useContext, useState, type ReactNode } from "react";
import React from "react";
import { trackConversion } from "@/lib/tracking";
import { trackPixel } from "@/lib/meta-pixel";

interface QuizModalContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const QuizModalContext = createContext<QuizModalContextValue | null>(null);

export function QuizModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => {
    trackConversion('lead', { action: 'quiz_opened' });
    trackPixel('QuizStarted', { source: 'lp-03' });
    setIsOpen(true);
  };
  const close = () => setIsOpen(false);

  return React.createElement(
    QuizModalContext.Provider,
    { value: { isOpen, open, close } },
    children
  );
}

export function useQuizModal(): QuizModalContextValue {
  const context = useContext(QuizModalContext);
  if (!context) {
    throw new Error("useQuizModal must be used within a QuizModalProvider");
  }
  return context;
}
