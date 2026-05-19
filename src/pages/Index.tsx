import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ClientLogosMarquee from "@/components/ClientLogosMarquee";
import MarqueeBanner from "@/components/MarqueeBanner";
import DoresSection from "@/components/DoresSection";
import CasesSection from "@/components/CasesSection";
import GiantMarquee from "@/components/GiantMarquee";
import DeliverablesSection from "@/components/DeliverablesSection";
import TargetAudienceSection from "@/components/TargetAudienceSection";
import NotForSection from "@/components/NotForSection";
import AboutSection from "@/components/AboutSection";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import { PopupProvider } from "@/hooks/usePopup";
import { Popup } from "@/popup/Popup";

const Index = () => {
  return (
    <PopupProvider>
      <main className="min-h-screen bg-nsm-dark-1">
        <Navbar />
        <HeroSection />
        <ClientLogosMarquee />
        <MarqueeBanner />
        <DoresSection />
        <CasesSection />
        <GiantMarquee />
        <DeliverablesSection />
        <TargetAudienceSection />
        <NotForSection />
        <AboutSection />
        <FAQSection />
        <CTASection />
        <Footer />
      </main>
      <Popup />
    </PopupProvider>
  );
};

export default Index;
