import { Fragment, type ReactNode } from "react";

// Em public/ e não em src/assets: abaixo de 4 KB o Vite embute a imagem em base64 no JS inicial e o lazy loading deixa de valer
const avatar = (slug: string) => `${import.meta.env.BASE_URL}clientes/${slug}.webp`;

const results = [
  { slug: "draevelynsoledade", name: "Dra. Evelyn Soledade", handle: "draevelynsoledade", result: "Investimento retornando em 29 dias" },
  { slug: "drleandro-evolution", name: "Instituto LS", handle: "drleandro_evolution", result: "Pacientes high ticket fechados no WhatsApp" },
  { slug: "chersaude", name: "Clínica CHER", handle: "chersaude", result: "A secretária que agendava virou comercial que fecha" },
  { slug: "dra-mariamel", name: "Dra. Maria Amélia", handle: "dra.mariamel", result: "Mais de R$ 150 mil faturados em 1 mês, sem depender da dona na operação comercial" },
  { slug: "dra-camillalimaa", name: "Dra. Camilla Lima", handle: "dra.camillalimaa", result: "Clínica de um só procedimento, com a agenda cheia" },
  { slug: "faceclin-estetica", name: "FaceClin", handle: "faceclin.estetica", result: "Orçamentos de alto valor fechados sem o paciente pedir para \"pensar melhor\"" },
  { slug: "kellyfigueireido", name: "Dra. Kelly", handle: "kellyfigueireido", result: "6 dígitos em um mês, só com pacientes vindos do digital" },
  { slug: "drasharmilaandrade", name: "Dra. Sharmila Andrade", handle: "drasharmilaandrade", result: "Recuperou o investimento em marketing na primeira semana de campanha" },
  { slug: "dr-humbertofilho", name: "Dr. Humberto Filho", handle: "dr.humbertofilho", result: "Mais de 6 dígitos com pacientes particulares" },
  { slug: "dr-raipaschoto", name: "Dr. Raí Paschoto", handle: "dr.raipaschoto", result: "De R$ 6 mil para R$ 39 mil em 35 dias" },
  { slug: "dr-oduvaldofilho", name: "Dr. Oduvaldo Filho", handle: "dr.oduvaldofilho", result: "5 pacientes vindos da captação atendidos em um só dia, e agendamentos chegando até do interior" },
  { slug: "clinicacarolinabarreto", name: "Clínica Carolina Barreto", handle: "clinicacarolinabarreto", result: "Recorde de faturamento: saiu do \"mês bom, mês ruim\" para meta batida meses seguidos" },
];

// Prints do grupo de WhatsApp da NSM com cada clínica; nomes, fotos e telefones tarjados no próprio arquivo
const prints = [
  { file: "print-01", w: 617, h: 880, alt: "Cliente no grupo com a NSM: vendas hoje 34k, em 3 procedimentos" },
  { file: "print-02", w: 576, h: 880, alt: "Cliente no grupo com a NSM: por enquanto até o momento 57k, as mulheres brigando por horário" },
  { file: "print-03", w: 995, h: 880, alt: "Cliente no grupo com a NSM: fechei uma venda hoje de 9k" },
  { file: "print-04", w: 586, h: 510, alt: "Cliente para a NSM: não sei o que vocês fizeram de mudança no tráfego, mas deu certo, só hoje tivemos 5 agendamentos" },
  { file: "print-05", w: 669, h: 880, alt: "Clínica passando o valor gerado por canal na semana: harmonização glútea R$ 13.080,00" },
  { file: "print-06", w: 934, h: 880, alt: "Cliente no grupo com a NSM: hoje fechei mais 1 de anúncio, já pagou a reserva da agenda" },
  { file: "print-07", w: 860, h: 880, alt: "Cliente no grupo com a NSM: 4 pacientes agendadas pelo tráfego, de ontem para cá" },
  { file: "print-08", w: 808, h: 880, alt: "Cliente no grupo com a NSM: tivemos 02 tratamentos fechados" },
];

// Faixa que corre de lado: reaproveita o animate-marquee-scroll do tailwind.config (0 a -50%), por isso o conteúdo entra duas vezes
// e o respiro entre itens é padding do item, não gap (com gap o laço dá um salto de meio espaço).
// Pausa no hover e no toque; com prefers-reduced-motion vira trilho parado de deslizar.
// copies: o laço anda metade da faixa, então metade das cópias tem de cobrir a tela; 2 bastam se o conteúdo for largo.
const Marquee = ({ seconds, reverse, copies = 2, children }: { seconds: number; reverse?: boolean; copies?: number; children: (clone: boolean) => ReactNode }) => (
  // onTouchStart vazio: no Safari do iPhone o :active (pausa por toque) só dispara se existir um listener de touchstart
  <div onTouchStart={() => {}} className="group overflow-hidden motion-reduce:overflow-x-auto [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
    <ul
      className={`flex w-max ${reverse ? "animate-marquee-scroll-reverse" : "animate-marquee-scroll"} group-hover:[animation-play-state:paused] group-active:[animation-play-state:paused] motion-reduce:animate-none`}
      style={{ animationDuration: `${seconds}s` }}
    >
      {Array.from({ length: copies }, (_, i) => <Fragment key={i}>{children(i > 0)}</Fragment>)}
    </ul>
  </div>
);

const ResultCards = ({ items, clone }: { items: typeof results; clone: boolean }) => (
  <>
    {items.map((item) => (
      <li key={item.handle} aria-hidden={clone || undefined} className="pr-4 md:pr-6 shrink-0 w-[290px] md:w-[360px]">
        <div className="card-outline h-full p-6 flex flex-col justify-between gap-6">
          <p className="text-lg leading-snug text-nlm-title">{item.result}</p>
          <div className="flex items-center gap-3 pt-4 border-t border-nlm-stroke">
            <img
              src={avatar(item.slug)}
              alt=""
              width={48}
              height={48}
              loading="lazy"
              decoding="async"
              className="w-12 h-12 rounded-full object-cover shrink-0"
            />
            <div className="min-w-0">
              <p className="text-sm font-medium text-nlm-title truncate">{item.name}</p>
              {/* @ sem link, para não tirar tráfego pago da página */}
              <p className="text-xs text-nlm-secondary truncate">@{item.handle}</p>
            </div>
          </div>
        </div>
      </li>
    ))}
  </>
);

const ResultsWallSection = () => {
  return (
    <section className="section-plain py-24 md:py-32">
      <div className="container mx-auto px-6 text-center mb-10 md:mb-14">
        <p className="section-label">Não são só três casos</p>
        <h2 className="font-display text-2xl md:text-3xl font-normal">
          Especialidades diferentes, clínicas diferentes,{" "}
          <span className="text-nlm-blue">o mesmo sistema.</span>
        </h2>
      </div>

      <div className="space-y-4 md:space-y-6">
        <Marquee seconds={120} copies={4}>{(clone) => <ResultCards items={results.slice(0, 6)} clone={clone} />}</Marquee>
        <Marquee seconds={120} copies={4} reverse>{(clone) => <ResultCards items={results.slice(6)} clone={clone} />}</Marquee>
      </div>

      <div className="container mx-auto px-6 text-center mt-16 md:mt-24 mb-10 md:mb-14">
        <p className="section-label">Direto do WhatsApp</p>
        <h3 className="font-display text-xl md:text-2xl font-normal">
          É assim que o resultado chega no grupo da clínica com a NSM
        </h3>
      </div>

      <Marquee seconds={80}>
        {(clone) =>
          prints.map((print) => (
            <li key={print.file} aria-hidden={clone || undefined} className="pr-4 md:pr-6 shrink-0">
              <img
                src={`${import.meta.env.BASE_URL}prints/${print.file}.webp`}
                alt={clone ? "" : print.alt}
                width={print.w}
                height={print.h}
                loading="lazy"
                decoding="async"
                className="h-[360px] md:h-[440px] w-auto rounded-2xl border border-nlm-stroke"
              />
            </li>
          ))
        }
      </Marquee>
    </section>
  );
};

export default ResultsWallSection;
