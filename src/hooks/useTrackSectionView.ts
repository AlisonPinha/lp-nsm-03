/**
 * Hook que dispara um único evento `ViewContent` no Pixel quando a seção entra
 * em viewport. Usado para públicos de remarketing qualificado (quem viu prova
 * social, oferta, dores) sem inflar evento de conversão.
 */
import { useEffect, useRef } from "react";
import { trackPixel } from "@/lib/meta-pixel";

interface Options {
  threshold?: number;
  category?: string;
}

export function useTrackSectionView<T extends HTMLElement = HTMLElement>(
  name: string,
  options: Options = {},
) {
  const ref = useRef<T | null>(null);
  const fired = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || fired.current) return;
    if (typeof IntersectionObserver !== "function") return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !fired.current) {
          fired.current = true;
          trackPixel("ViewContent", {
            content_name: name,
            content_category: options.category ?? "lp-section",
          });
          obs.disconnect();
        }
      },
      { threshold: options.threshold ?? 0.5 },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [name, options.threshold, options.category]);

  return ref;
}
