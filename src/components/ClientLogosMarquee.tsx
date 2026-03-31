const logos = [
  "Dra. Kelly",
  "Dr. Humberto Filho",
  "Dr. Raí Paschoto",
];

const ClientLogosMarquee = () => {
  const repeated = [...logos, ...logos, ...logos, ...logos];

  return (
    <section className="section-dark py-10 border-y border-white/5">
      <div className="marquee-container">
        <div className="marquee-track animate-marquee-scroll">
          {repeated.map((name, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-3 mx-8 text-white/25 text-sm font-medium uppercase tracking-widest whitespace-nowrap"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-nsm-green/40" />
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientLogosMarquee;
