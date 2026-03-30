import HeroSection from "./components/home/HeroSection";
import EmergencyTypesSection from "./components/home/EmergencyTypesSection";
import HowItWorksSection from "./components/home/HowItWorksSection";
import FeaturesSection from "./components/home/FeaturesSection";
import VolunteersSection from "./components/home/Volunteerssection";
import RecentEmergenciesSection from "./components/home/Recentemergenciessection";
import CTASection from "./components/home/Ctasection";



export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <HeroSection />
      <EmergencyTypesSection />
      <HowItWorksSection />
      <FeaturesSection />
      <VolunteersSection />
      <RecentEmergenciesSection />
      <CTASection />
    </main>
  );
}