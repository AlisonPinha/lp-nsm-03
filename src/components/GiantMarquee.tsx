const GiantMarquee = () => {
  const text = "NUTRA SEU MARKETING \u2022 ";
  const repeated = text.repeat(6);

  return (
    <section className="section-cream py-12 md:py-16">
      <div className="marquee-container">
        <div className="marquee-track animate-marquee-scroll-fast">
          <span
            className="font-display font-bold whitespace-nowrap"
            style={{
              fontSize: "clamp(60px, 10vw, 120px)",
              color: "rgba(26, 26, 26, 0.08)",
              lineHeight: 1.1,
            }}
          >
            {repeated}
          </span>
          <span
            className="font-display font-bold whitespace-nowrap"
            style={{
              fontSize: "clamp(60px, 10vw, 120px)",
              color: "rgba(26, 26, 26, 0.08)",
              lineHeight: 1.1,
            }}
          >
            {repeated}
          </span>
        </div>
      </div>
    </section>
  );
};

export default GiantMarquee;
