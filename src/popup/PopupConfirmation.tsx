import { CheckCircle2 } from "lucide-react";

interface Props {
  onClose: () => void;
}

export function PopupConfirmation({ onClose }: Props) {
  return (
    <div className="quiz-slide-up text-center px-2 py-2">
      <div className="mx-auto w-14 h-14 rounded-full bg-nsm-green/15 flex items-center justify-center mb-5">
        <CheckCircle2 className="w-8 h-8 text-nsm-green" />
      </div>

      <h3 className="font-display text-2xl md:text-3xl font-medium text-white mb-4">
        Cadastro recebido!
      </h3>

      <div className="space-y-4 text-white/70 font-body text-base md:text-lg leading-relaxed max-w-md mx-auto">
        <p>
          Em até <strong className="text-white">10 minutos</strong> o Pedro vai te
          chamar no WhatsApp pra entender seu cenário.
        </p>
        <p>
          Se preferir reunião rápida no Meet, é só responder{" "}
          <strong className="text-white">"Meet"</strong> lá que combinamos um
          horário.
        </p>
        <p className="text-white/60">
          Deixa o celular por perto <span aria-hidden>🚀</span>
        </p>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="mt-8 text-sm text-white/40 hover:text-white/70 transition-colors font-body"
      >
        Fechar
      </button>
    </div>
  );
}
