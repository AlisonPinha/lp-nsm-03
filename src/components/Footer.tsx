const Footer = () => {
  return (
    <footer className="bg-nsm-dark-1 border-t border-white/5 py-8">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="font-display text-xl font-bold text-white tracking-tight">
          nsm
        </span>
        <p className="text-sm text-white/40">
          &copy; {new Date().getFullYear()} NSM Marketing. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
