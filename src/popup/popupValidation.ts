/**
 * Validação por campo do popup de captação.
 * Retorna mensagem de erro (PT-BR) ou null se válido.
 */

export const SEGMENT_OPTIONS = [
  "Estética",
  "Médica",
  "Odontológica",
  "Fisioterapia",
] as const;

export const REVENUE_OPTIONS = [
  "Até R$ 30 mil/mês",
  "R$ 30 mil a R$ 80 mil/mês",
  "R$ 80 mil a R$ 150 mil/mês",
  "R$ 150 mil a R$ 300 mil/mês",
  "R$ 300 mil a R$ 500 mil/mês",
  "Acima de R$ 500 mil/mês",
] as const;

export type Segment = (typeof SEGMENT_OPTIONS)[number];
export type Revenue = (typeof REVENUE_OPTIONS)[number];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateName(value: string): string | null {
  const v = value.trim();
  if (v.length < 2) return "Digite seu nome (mínimo 2 letras).";
  if (/\d/.test(v)) return "Nome não pode conter números.";
  return null;
}

export function validateEmail(value: string): string | null {
  const v = value.trim();
  if (!v) return "Digite seu e-mail.";
  if (!EMAIL_REGEX.test(v)) return "E-mail inválido.";
  return null;
}

export function validatePhone(value: string): string | null {
  const digits = value.replace(/\D/g, "");
  if (digits.length < 11) return "WhatsApp incompleto (use DDD + 9 dígitos).";
  if (digits.length > 11) return "WhatsApp inválido.";
  return null;
}

export function validateInstagram(value: string): string | null {
  const v = value.replace(/\s+/g, "").replace(/^@+/, "");
  if (v.length < 2) return "Digite o @ do Instagram.";
  if (!/^[a-zA-Z0-9._]+$/.test(v)) return "Use apenas letras, números, ponto ou underline.";
  return null;
}

export function validateClinicName(value: string): string | null {
  const v = value.trim();
  if (v.length < 2) return "Digite o nome da clínica (mínimo 2 letras).";
  return null;
}

export function validateSegment(value: string): string | null {
  if (!value) return "Escolha o segmento.";
  if (!SEGMENT_OPTIONS.includes(value as Segment)) return "Segmento inválido.";
  return null;
}

export function validateRevenue(value: string): string | null {
  if (!value) return "Escolha a faixa de faturamento.";
  if (!REVENUE_OPTIONS.includes(value as Revenue)) return "Faixa inválida.";
  return null;
}

export interface PopupForm {
  name: string;
  email: string;
  phone: string;
  instagram: string;
  clinicName: string;
  segment: string;
  revenue: string;
}

export type PopupErrors = Partial<Record<keyof PopupForm, string>>;

export function validateAll(form: PopupForm): PopupErrors {
  const errors: PopupErrors = {};
  const name = validateName(form.name);
  if (name) errors.name = name;
  const email = validateEmail(form.email);
  if (email) errors.email = email;
  const phone = validatePhone(form.phone);
  if (phone) errors.phone = phone;
  const instagram = validateInstagram(form.instagram);
  if (instagram) errors.instagram = instagram;
  const clinicName = validateClinicName(form.clinicName);
  if (clinicName) errors.clinicName = clinicName;
  const segment = validateSegment(form.segment);
  if (segment) errors.segment = segment;
  const revenue = validateRevenue(form.revenue);
  if (revenue) errors.revenue = revenue;
  return errors;
}

export function isFormValid(form: PopupForm): boolean {
  return Object.keys(validateAll(form)).length === 0;
}

/**
 * Máscara telefone BR fixa: (XX) XXXXX-XXXX
 * Recebe valor sujo (com qualquer char), retorna formatado.
 */
export function maskPhoneBR(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 11);
  if (digits.length === 0) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

/**
 * Normaliza o @ do Instagram: remove espaços, garante prefixo @.
 */
export function normalizeInstagram(raw: string): string {
  const cleaned = raw.replace(/\s+/g, "").replace(/^@+/, "");
  return cleaned ? `@${cleaned}` : "";
}
