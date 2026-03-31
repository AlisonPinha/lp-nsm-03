import { useState, useRef, useEffect } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "Quanto tempo leva pra ver os primeiros resultados?",
    answer:
      "Os primeiros agendamentos qualificados aparecem entre 2 e 4 semanas após a implementação. Resultados consistentes se consolidam entre 60 e 90 dias — depende da sua cidade, especialidade e ponto de partida.",
  },
  {
    question: "Preciso ter uma equipe de marketing?",
    answer:
      "Não. A NSM cuida de toda a estratégia e execução. Você só precisa de agenda pra atender os pacientes. Se tiver secretária ou recepcionista, a gente treina ela no processo.",
  },
  {
    question: "Qual o investimento mínimo em anúncios?",
    answer:
      "R$2.500/mês em mídia paga. Esse valor varia conforme cidade e especialidade — na sessão estratégica, calculamos juntos o número ideal pro seu caso.",
  },
  {
    question: "Vocês são uma agência de marketing?",
    answer:
      "Não. Agências entregam posts e cliques. A gente entrega pacientes na cadeira. Somos uma aceleradora de vendas — nosso sistema cobre da atração ao agendamento confirmado.",
  },
  {
    question: "E se eu já trabalho com uma agência?",
    answer:
      "Muitos dos nossos clientes vieram de agências genéricas que não geravam pacientes de alto valor. Na sessão, analisamos o que tá funcionando e o que precisa mudar — sem compromisso.",
  },
];

const FAQItem = ({
  faq,
  isOpen,
  onToggle,
}: {
  faq: { question: string; answer: string };
  isOpen: boolean;
  onToggle: () => void;
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  return (
    <div className="faq-item">
      <button onClick={onToggle} className="faq-item-trigger">
        <span className="text-lg font-medium text-nsm-dark-3 pr-4">
          {faq.question}
        </span>
        {isOpen ? (
          <Minus className="w-5 h-5 text-nsm-green shrink-0" />
        ) : (
          <Plus className="w-5 h-5 text-nsm-dark-3/40 shrink-0" />
        )}
      </button>
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: height }}
      >
        <div ref={contentRef} className="faq-item-content">
          <p className="text-nsm-dark-3/70 leading-relaxed">{faq.answer}</p>
        </div>
      </div>
    </div>
  );
};

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="section-cream py-24 md:py-32" id="faq">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <p className="section-label-dark">(08) Perguntas frequentes</p>
          <h2 className="font-display text-3xl md:text-4xl font-medium text-nsm-dark-3 mb-14">
            Dúvidas? A gente responde.
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                faq={faq}
                isOpen={openIndex === index}
                onToggle={() => toggle(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
