import { X } from "lucide-react";

const exclusoes = [
  "Ainda não tem clínica própria ou está começando do zero",
  "Não tem pelo menos R$2.500/mês para investir no seu crescimento",
  "Busca resultado imediato (menos de 60 dias)",
  "Não tem agenda para atender mais pacientes premium"
];

const NotForSection = () => {
  return (
    <section className="section-tint py-24 md:py-32">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <p className="section-label">(06) Transparência</p>

          <h2 className="font-display text-2xl md:text-3xl font-normal mb-12">
            Antes de continuar, isso{" "}
            <span className="text-nlm-negative">NÃO</span> é para você se:
          </h2>

          <div className="space-y-3 mb-12">
            {exclusoes.map((exclusao, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-5 rounded-xl bg-white"
              >
                <div className="w-7 h-7 rounded-full bg-nlm-negative-bg flex items-center justify-center shrink-0">
                  <X className="w-4 h-4 text-nlm-negative" />
                </div>
                <span className="text-nlm-body">{exclusao}</span>
              </div>
            ))}
          </div>

          <p className="text-center text-nlm-secondary">
            Se você se encaixa em qualquer item acima,{" "}
            <strong className="text-nlm-title">esse sistema não é para você.</strong>
          </p>
        </div>
      </div>
    </section>
  );
};

export default NotForSection;
