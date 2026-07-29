import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import MarqueeStrip from "@/components/sections/MarqueeStrip";
import AboutSection from "@/components/sections/AboutSection";
import RoomsShowcase from "@/components/sections/RoomsShowcase";
import ExperienceCarousel from "@/components/sections/ExperienceCarousel";
import StatsCounter from "@/components/sections/StatsCounter";
import Testimonials from "@/components/sections/Testimonials";
import GalleryGrid from "@/components/sections/GalleryGrid";
import KolkataGuide from "@/components/sections/KolkataGuide";
import ContactSection from "@/components/sections/ContactSection";
import Footer from "@/components/layout/Footer";
import { Metadata } from "next";
import { getPageSeo } from "@/lib/sanity";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("Homepage").catch(() => null);
  return {
    title: seo?.metaTitle || "Calcutta Backpackers | Best Value Poshtel in Kolkata (Dorms from ₹499)",
    description: seo?.metaDescription || "Kolkata's top-rated poshtel for backpackers and solo travelers. AC dorms from ₹499, private rooms from ₹1,999, free wifi, and WanderXP local experiences — street food crawls, heritage walks, rooftop nights. Book direct, no hidden fees.",
  };
}

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <MarqueeStrip />
      <AboutSection />
      <RoomsShowcase />
      <ExperienceCarousel />
      <StatsCounter />
      <Testimonials />
      <GalleryGrid />
      <KolkataGuide />
      <ContactSection />
      <Footer />
    </>
  );
}
