import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ImpactStats from "@/components/ImpactStats";
import RescueStories from "@/components/RescueStories";
import HelpCards from "@/components/HelpCards";
import EmergencyRescue from "@/components/EmergencyRescue";
import InstagramFeed from "@/components/InstagramFeed";
import DonationSection from "@/components/DonationSection";
import VolunteerSection from "@/components/VolunteerSection";
import RescueMap from "@/components/RescueMap";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <ImpactStats />
      <RescueStories />
      <HelpCards />
      <EmergencyRescue />
      <InstagramFeed />
      <DonationSection />
      <VolunteerSection />
      <RescueMap />
      <Footer />
    </main>
  );
}
