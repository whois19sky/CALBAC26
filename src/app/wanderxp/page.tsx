import { Metadata } from "next";
import { getPageSeo, getExperiences } from "@/lib/sanity";
import WanderXPClient from "./WanderXPClient";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("WanderXP").catch(() => null);
  return {
    title: seo?.metaTitle || "WanderXP | Kolkata Street Food Tours, Heritage Walks & Local Experiences",
    description: seo?.metaDescription || "Real Kolkata, not the guidebook version. WanderXP experiences from Calcutta Backpackers: street food crawls, heritage walks, sunrise boat rides, and Kumartuli art tours — priced for backpackers, led by locals.",
  };
}

export default async function WanderXPPage() {
  const experiences = await getExperiences().catch(() => []);

  // TouristTrip schema for each real experience, explicitly linked back to
  // Calcutta Backpackers as the provider - this is the entity connection that
  // tells search engines/AI answer engines "WanderXP is Calcutta Backpackers'
  // own experience brand," not an unrelated third party.
  const tripsStructuredData = experiences.map((exp) => ({
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "name": exp.title,
    "description": exp.description,
    "touristType": "Backpacker",
    "provider": {
      "@type": "Hostel",
      "name": "Calcutta Backpackers",
      "url": "https://www.calcuttabackpackers.com",
    },
    ...(exp.price > 0 && {
      "offers": {
        "@type": "Offer",
        "price": exp.price,
        "priceCurrency": "INR",
      },
    }),
    ...(exp.duration && { "itinerary": exp.duration }),
  }));

  return (
    <>
      {tripsStructuredData.map((trip, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(trip) }}
        />
      ))}
      <WanderXPClient />
    </>
  );
}
