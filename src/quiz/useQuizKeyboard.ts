import { useEffect } from "react";
import { useQuizModal } from "@/hooks/useQuizModal";

interface KeyboardOption {
  key: string;
  action: () => void;
}

interface UseQuizKeyboardParams {
  onEnter: () => void;
  onEscape?: () => void;
  options?: KeyboardOption[];
}

export function useQuizKeyboard({ onEnter, onEscape, options }: UseQuizKeyboardParams) {
  const { close } = useQuizModal();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Enter") {
        e.preventDefault();
        onEnter();
        return;
      }

      if (e.key === "Escape") {
        e.preventDefault();
        if (onEscape) {
          onEscape();
        } else {
          close();
        }
        return;
      }

      if (options && options.length > 0) {
        const keyNum = parseInt(e.key, 10);
        if (!isNaN(keyNum) && keyNum >= 1 && keyNum <= 9) {
          const match = options.find((opt) => opt.key === e.key);
          if (match) {
            e.preventDefault();
            match.action();
          }
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onEnter, onEscape, options, close]);
}
