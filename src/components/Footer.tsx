import logo from "@/assets/logo-nsm.png";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-nlm-stroke py-8">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <img src={logo} alt="Nutra Seu Marketing" width={1109} height={512} className="h-7 w-auto" />
        <p className="text-sm text-nlm-secondary">
          &copy; {new Date().getFullYear()} NSM Marketing. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
