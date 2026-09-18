import { ArrowUpRight } from "lucide-react";
import { usePopup } from "@/hooks/usePopup";

const MarqueeBanner = () => {
  const { open } = usePopup();
  return (
    <section className="section-tint py-24 md:py-32">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="section-label">(01) Atenção</p>

          <h2 className="font-display text-3xl md:text-[40px] font-normal leading-tight mb-8 text-balance">
            Atenção: Somente para donos de clínicas médicas, odontológicas ou estéticas que já faturam e querem escalar com pacientes de{" "}
            <span className="text-nlm-blue">alto valor.</span>
          </h2>

          <button type="button" onClick={open} className="btn-primary inline-flex">
            <span>Quero escalar minha clínica</span>
            <ArrowUpRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default MarqueeBanner;
