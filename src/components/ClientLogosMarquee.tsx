const logos = [
  "Dra. Kelly",
  "Dr. Humberto Filho",
  "Dr. Raí Paschoto",
  "Dra. Evelyn Soledade",
  "Instituto LS",
  "Clínica CHER",
  "Dra. Maria Amélia",
  "Dra. Camilla Lima",
  "FaceClin",
  "Dra. Sharmila Andrade",
  "Dr. Oduvaldo Filho",
  "Clínica Carolina Barreto",
];

const ClientLogosMarquee = () => {
  const repeated = [...logos, ...logos];

  return (
    <section className="section-plain py-10 border-y border-nlm-stroke">
      <div className="marquee-container">
        {/* 12 nomes: 60s mantém a velocidade que a faixa tinha com 3 */}
        <div className="marquee-track animate-marquee-scroll" style={{ animationDuration: "60s" }}>
          {repeated.map((name, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-3 mx-8 text-nlm-secondary text-sm font-medium uppercase tracking-widest whitespace-nowrap"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-nlm-blue/40" />
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientLogosMarquee;
