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
import { Metadata } from "next";
import { getPageSeo, getRooms, getExperiences, getTestimonials } from "@/lib/sanity";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("Homepage").catch(() => null);
  return {
    title: seo?.metaTitle || "Calcutta Backpackers | Best Hostel in Kolkata (Poshtel-Style Dorms from ₹499)",
    description: seo?.metaDescription || "Kolkata's top-rated hostel for backpackers and solo travelers — a poshtel-style stay with AC dorms from ₹499, private rooms from ₹1,999, free wifi, and WanderXP local experiences — street food crawls, heritage walks, rooftop nights. Book direct, no hidden fees.",
  };
}

export default async function Home() {
  // Fetched once, server-side, and handed down as initial data - this is the
  // site's highest-traffic page, so having rooms/experiences/reviews present
  // in the first server-rendered HTML (rather than only after a client-side
  // fetch) matters for both SEO and how fast the page feels to load.
  // getTestimonials() is also called in the root layout for the page's
  // structured data - cache() dedupes that automatically into one request.
  const [rooms, experiences, testimonials] = await Promise.all([
    getRooms().catch(() => []),
    getExperiences().catch(() => []),
    getTestimonials().catch(() => []),
  ]);

  return (
    <>

      <HeroSection />
      <MarqueeStrip />
      <AboutSection />
      <RoomsShowcase initialRooms={rooms} />
      <ExperienceCarousel initialExperiences={experiences} />
      <StatsCounter initialTestimonials={testimonials} />
      <Testimonials initialTestimonials={testimonials} />
      <GalleryGrid />
      <KolkataGuide />
      <ContactSection />

    </>
  );
}
