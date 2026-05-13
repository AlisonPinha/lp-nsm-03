import { useTrackSectionView } from "@/hooks/useTrackSectionView";

const dores = [
  {
    title: 'A Guerra do "Quanto Custa?"',
    description: 'Você posta um caso incrível. O direct enche de "quanto custa?", você responde o valor e... silêncio. O paciente some, provavelmente assustado com o preço, porque ele ainda não enxergou o valor.'
  },
  {
    title: "A Síndrome do Concorrente Inferior",
    description: "Você vê profissionais com menos técnica, menos estudo e casos visivelmente inferiores lotando a agenda. Enquanto isso, você, com toda a sua capacidade, luta para atrair os pacientes certos."
  },
  {
    title: "O Medo de Investir em Tráfego",
    description: "Você até pensa em investir em anúncios, mas o pensamento de gastar R$500 ou R$1.000 e atrair o público errado te paralisa. Você sabe que precisa de mais pacientes, mas não sabe como fazer isso de forma previsível."
  },
  {
    title: 'O Efeito "Mais do Mesmo"',
    description: 'Seu Instagram parece um cardápio de procedimentos. Limpeza, botox, clareamento, harmonização... Você se sente apenas "mais uma clínica", e não A REFERÊNCIA que resolve casos complexos e cobra caro por isso.'
  }
];

const DoresSection = () => {
  const sectionRef = useTrackSectionView<HTMLElement>("lp-03-dores");
  return (
    <section ref={sectionRef} className="section-dark py-24 md:py-32" id="dores">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <p className="section-label">(02) Identificação</p>

          <h2 className="font-display text-2xl md:text-3xl font-medium mb-16 text-balance max-w-3xl">
            Se você se identifica com alguma dessas situações,{" "}
            <span className="text-nsm-green">essa conversa é para você.</span>
          </h2>

          <div className="space-y-0">
            {dores.map((dor, index) => (
              <div key={index}>
                {index > 0 && <div className="divider-line" />}
                <div className="py-8 md:py-10 flex flex-col md:flex-row md:items-start gap-4 md:gap-8">
                  <div className="flex items-center gap-4 md:w-72 shrink-0">
                    <span className="text-white/20 font-display text-sm font-medium">
                      /{String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-nsm-green text-lg">*</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-xl md:text-2xl font-medium mb-3">
                      {dor.title}
                    </h3>
                    <p className="text-white/50 leading-relaxed font-body">
                      {dor.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div className="divider-line" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DoresSection;
