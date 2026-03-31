import { useRef, useEffect } from "react";

interface QuizTextInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  type?: string;
  label: string;
  autoFocus?: boolean;
  maxLength?: number;
}

export default function QuizTextInput({
  value,
  onChange,
  placeholder,
  type = "text",
  label,
  autoFocus = true,
  maxLength,
}: QuizTextInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const isTel = type === "tel";

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Label */}
      <label className="text-white/80 text-base font-body font-medium mb-3 block">
        {label}
      </label>

      {/* Input wrapper */}
      {isTel ? (
        <div className="relative flex items-center w-full bg-nsm-dark-3 border border-white/10 rounded-xl overflow-hidden focus-within:border-nsm-green focus-within:ring-1 focus-within:ring-nsm-green/30 transition-colors">
          {/* BR flag prefix */}
          <span className="flex-shrink-0 flex items-center gap-1.5 pl-5 pr-3 text-white/70 font-body text-lg select-none">
            <span className="text-base">🇧🇷</span>
            <span>+55</span>
          </span>

          <input
            ref={inputRef}
            type="tel"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            maxLength={maxLength}
            className="flex-1 bg-transparent py-4 pr-5 text-white text-lg font-body placeholder:text-white/30 focus:outline-none"
          />
        </div>
      ) : (
        <input
          ref={inputRef}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          className="w-full bg-nsm-dark-3 border border-white/[0.15] rounded-xl px-5 py-4 text-white text-lg font-body placeholder:text-white/30 focus:outline-none focus:border-nsm-green focus:ring-1 focus:ring-nsm-green/30 transition-colors"
        />
      )}
    </div>
  );
}
