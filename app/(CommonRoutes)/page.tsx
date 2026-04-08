import HeroSection from "./components/home/HeroSection";
import EmergencyTypesSection from "./components/home/EmergencyTypesSection";
import HowItWorksSection from "./components/home/HowItWorksSection";
import FeaturesSection from "./components/home/FeaturesSection";
import VolunteersSection from "./components/home/Volunteerssection";
import RecentEmergenciesSection from "./components/home/Recentemergenciessection";
import CTASection from "./components/home/Ctasection";
import { useEffect } from "react";
import { useRouter } from "next/navigation";




export default function HomePage() {
  const router = useRouter()
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");
    const sessionToken = params.get("sessionToken");

    if (accessToken && refreshToken) {
      document.cookie = `accessToken=${accessToken}; path=/; secure; samesite=strict; max-age=${60 * 60 * 24}`;
      document.cookie = `refreshToken=${refreshToken}; path=/; secure; samesite=strict; max-age=${60 * 60 * 24 * 7}`;
      if (sessionToken) {
        document.cookie = `better-auth-session_token=${sessionToken}; path=/; secure; samesite=strict; max-age=${60 * 60 * 24 * 7}`;
      }
      window.history.replaceState({}, "", window.location.pathname);
      router.refresh();
    }
  }, [router]);
  return (
    <main className="min-h-screen bg-white">
      <HeroSection />
      <EmergencyTypesSection />
      <HowItWorksSection />
      <FeaturesSection />
      <RecentEmergenciesSection />
      <VolunteersSection />
      <CTASection />
    </main>
  );
}