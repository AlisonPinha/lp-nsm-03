import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { usePopup } from "@/hooks/usePopup";
import logo from "@/assets/logo-nsm.png";

const navLinks = [
  { label: "Dores", href: "#dores" },
  { label: "Entregáveis", href: "#entregaveis" },
  { label: "Cases", href: "#cases" },
  { label: "Sobre", href: "#sobre" },
  { label: "FAQ", href: "#faq" },
];

const Navbar = () => {
  const { open } = usePopup();
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
          ? "bg-white/85 backdrop-blur-md border-b border-nlm-stroke"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <a href="#" className="flex items-center">
          <img src={logo} alt="Nutra Seu Marketing" width={1109} height={512} className="h-8 w-auto" />
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-nlm-secondary hover:text-nlm-title transition-colors font-body"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <button
          type="button"
          onClick={open}
          className="hidden md:inline-flex items-center gap-2 h-10 px-5 rounded-full bg-black text-white text-sm font-medium transition-colors hover:bg-black/85"
        >
          Agendar sessão
        </button>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-nlm-title p-2"
          aria-label="Menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-b border-nlm-stroke px-6 py-6 space-y-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block text-base text-nlm-body hover:text-nlm-title transition-colors"
            >
              {link.label}
            </a>
          ))}
          <button
            type="button"
            onClick={() => { setMobileOpen(false); open(); }}
            className="block w-full text-center px-5 py-3 rounded-full bg-black text-white font-medium text-sm"
          >
            Agendar sessão
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
