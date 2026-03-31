import { AlertCircle } from "lucide-react";

const ProblemSection = () => {
  return (
    <section className="section-dark py-24">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              Cansado de profissionais
              de marketing que não
              entendem a área da saúde?
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Imagine ter sua agenda lotada de pacientes
              particulares todos os dias, com estratégias
              de <span className="text-primary font-semibold">inteligência artificial, marketing, vendas.</span>
            </p>
          </div>
          
          <div className="flex items-start gap-4">
            <AlertCircle className="w-8 h-8 text-highlight shrink-0 mt-1" />
            <p className="text-xl md:text-2xl leading-relaxed">
              Atraímos o público certo para sua
              <span className="text-highlight font-semibold"> clínica</span>, aumentando seu faturamento
              consolidando sua autoridade.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
