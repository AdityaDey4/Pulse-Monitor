import Navbar from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero"; // ← add the curly braces
import TechStack from "@/components/landing/tech-stack";
import FeatureBento from "@/components/landing/feature-bento";
import MissionControl from "@/components/landing/mission-control";
import ArchitectureFlow from "@/components/landing/architecture-flow";
import AnalyticsShowcase from "@/components/landing/analytics-showcase";
import TechnicalDeepDive from "@/components/landing/technical-deep-dive";
import CTA from "@/components/landing/cta";
import Footer from "@/components/landing/footer";

export default function HomePage() {
  return (
    <main className="bg-[#050816] text-white overflow-x-hidden">
      <Navbar />
      <Hero />
      <ArchitectureFlow/>
      <TechStack/>
      <FeatureBento/>
      <MissionControl/>

      <AnalyticsShowcase/>
      <TechnicalDeepDive/>
      <CTA/>
      <Footer/>
    </main>
  );
}