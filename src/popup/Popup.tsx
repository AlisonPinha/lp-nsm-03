import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowUpRight, Loader2, X } from "lucide-react";
import { usePopup } from "@/hooks/usePopup";
import { getVisitorId } from "@/lib/tracking";
import { setAdvancedMatching, trackPixel } from "@/lib/meta-pixel";
import { submitPopup } from "./submitPopup";
import { PopupConfirmation } from "./PopupConfirmation";
import {
  REVENUE_OPTIONS,
  SEGMENT_OPTIONS,
  isFormValid,
  maskPhoneBR,
  normalizeInstagram,
  validateClinicName,
  validateInstagram,
  validateName,
  validatePhone,
  validateRevenue,
  validateSegment,
  type PopupErrors,
  type PopupForm,
} from "./popupValidation";

const EMPTY_FORM: PopupForm = {
  name: "",
  phone: "",
  instagram: "",
  clinicName: "",
  segment: "",
  revenue: "",
};

type Status = "idle" | "submitting" | "success" | "error";

function PopupContent() {
  const { isOpen, close } = usePopup();
  const [form, setForm] = useState<PopupForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<PopupErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const firstFieldRef = useRef<HTMLInputElement | null>(null);

  /* Reset ao abrir/fechar */
  useEffect(() => {
    if (!isOpen) return;
    setForm(EMPTY_FORM);
    setErrors({});
    setStatus("idle");
    setSubmitError(null);
    /* foca primeiro campo */
    const t = setTimeout(() => firstFieldRef.current?.focus(), 80);
    return () => clearTimeout(t);
  }, [isOpen]);

  /* Lock body scroll */
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [isOpen]);

  /* ESC pra fechar */
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, close]);

  if (!isOpen) return null;

  const portalRoot = document.getElementById("quiz-root");
  if (!portalRoot) return null;

  const setField = <K extends keyof PopupForm>(key: K, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    /* limpa erro do campo enquanto digita */
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleBlur = (key: keyof PopupForm) => {
    const value = form[key];
    let err: string | null = null;
    switch (key) {
      case "name":
        err = validateName(value);
        break;
      case "phone":
        err = validatePhone(value);
        break;
      case "instagram":
        err = validateInstagram(value);
        if (!err) {
          /* normaliza no blur */
          setForm((prev) => ({ ...prev, instagram: normalizeInstagram(value) }));
        }
        break;
      case "clinicName":
        err = validateClinicName(value);
        break;
      case "segment":
        err = validateSegment(value);
        break;
      case "revenue":
        err = validateRevenue(value);
        break;
    }
    setErrors((prev) => ({ ...prev, [key]: err ?? undefined }));
  };

  const valid = isFormValid(form);
  const submitting = status === "submitting";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid || submitting) return;

    setStatus("submitting");
    setSubmitError(null);

    try {
      const normalizedInstagram = normalizeInstagram(form.instagram);
      const finalForm: PopupForm = { ...form, instagram: normalizedInstagram };

      const { leadEventId } = await submitPopup(finalForm);

      /* AM ANTES do Lead pra subir Match Quality */
      const [firstName, ...rest] = finalForm.name.trim().split(/\s+/);
      await setAdvancedMatching({
        phone: finalForm.phone,
        firstName,
        lastName: rest.join(" ") || undefined,
        externalId: getVisitorId() ?? undefined,
      });
      trackPixel(
        "Lead",
        {
          content_name: finalForm.segment,
          content_category: "popup_complete",
        },
        leadEventId,
      );

      setStatus("success");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Não foi possível enviar agora. Tente de novo.";
      setSubmitError(message);
      setStatus("error");
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto p-4 md:p-6"
      style={{ background: "rgba(7, 7, 8, 0.92)", backdropFilter: "blur(6px)" }}
      role="dialog"
      aria-modal="true"
      aria-label="Captação NSM"
      onClick={close}
    >
      <div
        className="relative w-full max-w-lg quiz-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="rounded-2xl border bg-nsm-dark-2 p-6 md:p-8"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}
        >
          {/* Close */}
          <button
            type="button"
            onClick={close}
            aria-label="Fechar"
            className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors p-2"
          >
            <X className="w-5 h-5" />
          </button>

          {status === "success" ? (
            <PopupConfirmation onClose={close} />
          ) : (
            <>
              {/* Header */}
              <div className="mb-6 pr-6">
                <p className="text-xs font-medium tracking-widest uppercase text-nsm-green/80 mb-2 font-body">
                  Sessão estratégica NSM
                </p>
                <h2 className="font-display text-2xl md:text-3xl font-medium text-white leading-tight mb-2">
                  Fale com um <span className="text-nsm-green">consultor</span>
                </h2>
                <p className="text-sm text-white/50 font-body">
                  Preencha os dados — Pedro te chama em até 10 minutos no
                  WhatsApp.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {/* Nome */}
                <Field
                  label="Seu nome"
                  error={errors.name}
                  htmlFor="popup-name"
                >
                  <input
                    ref={firstFieldRef}
                    id="popup-name"
                    type="text"
                    autoComplete="name"
                    inputMode="text"
                    placeholder="Como você prefere ser chamado(a)?"
                    value={form.name}
                    onChange={(e) => setField("name", e.target.value)}
                    onBlur={() => handleBlur("name")}
                    className="quiz-input text-base md:text-lg"
                  />
                </Field>

                {/* Telefone BR fixo */}
                <Field
                  label="WhatsApp com DDD"
                  error={errors.phone}
                  htmlFor="popup-phone"
                >
                  <div className="flex">
                    <span
                      className="inline-flex items-center gap-2 px-4 rounded-l-xl border border-r-0 text-white/70 text-base font-body"
                      style={{
                        background: "#141416",
                        borderColor: "rgba(255,255,255,0.1)",
                      }}
                      aria-hidden
                    >
                      <span className="text-lg leading-none">🇧🇷</span>
                      <span className="text-sm">+55</span>
                    </span>
                    <input
                      id="popup-phone"
                      type="tel"
                      autoComplete="tel-national"
                      inputMode="tel"
                      placeholder="(11) 99999-9999"
                      value={form.phone}
                      onChange={(e) => setField("phone", maskPhoneBR(e.target.value))}
                      onBlur={() => handleBlur("phone")}
                      className="quiz-input rounded-l-none text-base md:text-lg flex-1 min-w-0"
                    />
                  </div>
                </Field>

                {/* Instagram */}
                <Field
                  label="@ do Instagram da sua clínica"
                  error={errors.instagram}
                  htmlFor="popup-instagram"
                >
                  <input
                    id="popup-instagram"
                    type="text"
                    autoComplete="off"
                    inputMode="text"
                    placeholder="@suaclinica"
                    value={form.instagram}
                    onChange={(e) => {
                      /* remove espaços enquanto digita */
                      setField("instagram", e.target.value.replace(/\s+/g, ""));
                    }}
                    onBlur={() => handleBlur("instagram")}
                    className="quiz-input text-base md:text-lg"
                  />
                </Field>

                {/* Nome da clínica */}
                <Field
                  label="Nome da sua clínica"
                  error={errors.clinicName}
                  htmlFor="popup-clinic"
                >
                  <input
                    id="popup-clinic"
                    type="text"
                    autoComplete="organization"
                    inputMode="text"
                    placeholder="Clínica Smith"
                    value={form.clinicName}
                    onChange={(e) => setField("clinicName", e.target.value)}
                    onBlur={() => handleBlur("clinicName")}
                    className="quiz-input text-base md:text-lg"
                  />
                </Field>

                {/* Segmento */}
                <Field
                  label="Segmento"
                  error={errors.segment}
                  htmlFor="popup-segment"
                >
                  <select
                    id="popup-segment"
                    value={form.segment}
                    onChange={(e) => setField("segment", e.target.value)}
                    onBlur={() => handleBlur("segment")}
                    className="quiz-input text-base md:text-lg appearance-none cursor-pointer"
                  >
                    <option value="" disabled>
                      Escolha o segmento
                    </option>
                    {SEGMENT_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </Field>

                {/* Faturamento */}
                <Field
                  label="Faturamento mensal"
                  error={errors.revenue}
                  htmlFor="popup-revenue"
                >
                  <select
                    id="popup-revenue"
                    value={form.revenue}
                    onChange={(e) => setField("revenue", e.target.value)}
                    onBlur={() => handleBlur("revenue")}
                    className="quiz-input text-base md:text-lg appearance-none cursor-pointer"
                  >
                    <option value="" disabled>
                      Escolha a faixa
                    </option>
                    {REVENUE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </Field>

                {/* CTA */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={!valid || submitting}
                    className="btn-neon w-full justify-center disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Enviando...</span>
                      </>
                    ) : (
                      <>
                        <span>Quero falar com um consultor</span>
                        <ArrowUpRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                  {submitError && (
                    <p className="mt-3 text-sm text-red-400 text-center font-body">
                      {submitError}
                    </p>
                  )}
                  <p className="mt-3 text-xs text-white/30 text-center font-body">
                    Seus dados ficam só com a NSM. Sem spam.
                  </p>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>,
    portalRoot,
  );
}

interface FieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}

function Field({ label, htmlFor, error, children }: FieldProps) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-white/80 mb-2 font-body"
      >
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 text-xs text-red-400 font-body" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function Popup() {
  return <PopupContent />;
}
