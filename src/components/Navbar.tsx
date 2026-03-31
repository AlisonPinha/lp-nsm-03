import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useQuizModal } from "@/hooks/useQuizModal";

const navLinks = [
  { label: "Dores", href: "#dores" },
  { label: "Entregáveis", href: "#entregaveis" },
  { label: "Cases", href: "#cases" },
  { label: "Sobre", href: "#sobre" },
  { label: "FAQ", href: "#faq" },
];

const Navbar = () => {
  const { open } = useQuizModal();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-nsm-dark-1/95 backdrop-blur-md border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <a href="#" className="font-display text-2xl font-bold text-white tracking-tight">
          nsm
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-white/60 hover:text-white transition-colors font-body"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <button
          type="button"
          onClick={open}
          className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-nsm-green text-nsm-dark-1 text-sm font-semibold transition-all hover:shadow-neon-glow-sm hover:-translate-y-0.5"
        >
          Agendar sessão
        </button>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-white p-2"
          aria-label="Menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-nsm-dark-1/98 backdrop-blur-md border-t border-white/5 px-6 py-6 space-y-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block text-base text-white/70 hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
          <button
            type="button"
            onClick={() => { setMobileOpen(false); open(); }}
            className="block w-full text-center px-5 py-3 rounded-full bg-nsm-green text-nsm-dark-1 font-semibold text-sm"
          >
            Agendar sessão
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
