import pedroImage from "@/assets/pedro-actis.jpg";
import { Award, TrendingUp, Users, Target, Zap } from "lucide-react";

const authorityPoints = [
  { icon: Award, text: "Fundador da NSM, aceleradora de vendas para clínicas premium" },
  { icon: TrendingUp, text: "Especialista em gerar resultados concretos via marketing digital" },
  { icon: Users, text: "Dezenas de clínicas transformadas em referências locais" },
  { icon: Target, text: "Sistema comercial completo: da atração ao paciente na cadeira" },
  { icon: Zap, text: "Formado em disciplina no tatame, aplicada nos negócios" }
];

const AboutSection = () => {
  return (
    <section className="section-dark py-24 md:py-32 relative overflow-hidden" id="sobre">
      {/* Subtle glow right */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[400px] h-[400px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(140,255,46,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="container mx-auto px-6 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div>
              <p className="section-label">(07) Sobre o fundador</p>
              <h2 className="font-display text-3xl md:text-4xl font-medium">
                Prazer, sou <span className="text-nsm-green">Pedro Actis</span>
              </h2>
            </div>

            <p className="text-white/50 leading-relaxed font-body">
              Cristão, esposo e empresário. Fundador da NSM e alguém que busca, com <strong className="text-white">disciplina</strong>, ser a melhor versão de si mesmo todos os dias.
            </p>

            {/* Authority bullets */}
            <div className="space-y-4">
              {authorityPoints.map((point, index) => {
                const IconComponent = point.icon;
                return (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-lg bg-nsm-green/10 flex items-center justify-center shrink-0">
                      <IconComponent className="w-4 h-4 text-nsm-green" />
                    </div>
                    <span className="text-white/80 text-sm font-body">{point.text}</span>
                  </div>
                );
              })}
            </div>

            {/* Quote highlight */}
            <blockquote className="border-l-2 border-nsm-green/50 pl-6 py-4">
              <p className="text-white/50 italic leading-relaxed font-body">
                "Clínicas incríveis presas no anonimato, competindo por preço. Elas não precisavam de mais um 'post bonitinho'. Precisavam de um{" "}
                <strong className="text-nsm-green">SISTEMA DE VENDAS</strong>."
              </p>
            </blockquote>

            <p className="text-white/50 text-sm leading-relaxed font-body">
              <strong className="text-white">Não somos uma agência.</strong> Somos uma aceleradora de vendas focada em transformar clínicas em <strong className="text-white">referências</strong> nas suas cidades. E tudo começa com uma conversa.
            </p>
          </div>

          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden border border-white/[0.06]">
              <img
                src={pedroImage}
                alt="Pedro Actis - Fundador"
                className="w-full h-auto object-cover"
              />

              {/* Instagram badge */}
              <div className="absolute bottom-4 left-4 bg-nsm-dark-1/95 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-3 border border-white/[0.06]">
                <div className="w-9 h-9 rounded-full bg-nsm-dark-3 overflow-hidden">
                  <img
                    src={pedroImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-white flex items-center gap-1.5">
                    @pedroactis.ads
                    <span className="w-4 h-4 bg-nsm-green rounded-full flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-nsm-dark-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </p>
                  <p className="text-xs text-white/40">Marketing e vendas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
