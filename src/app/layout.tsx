import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Analytics from "@/components/Analytics";
import SiteChrome from "@/components/layout/SiteChrome";
import { getSiteSettings, getTestimonials, hasValidImage, urlFor } from "@/lib/sanity";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings().catch(() => null);
  const logoUrl = hasValidImage(settings?.logo)
    ? urlFor(settings!.logo).width(256).url()
    : "/images/CB Logo new.png";

  const title = settings?.defaultMetaTitle || "Calcutta Backpackers | Best Hostel in Kolkata (Poshtel-Style Dorms from ₹499)";
  const description = settings?.defaultMetaDescription ||
    "Kolkata's top-rated hostel for backpackers and solo travelers — a poshtel-style stay with stylish dorms from ₹499/night, private rooms, free wifi, and WanderXP experiences (street food crawls, heritage walks, rooftop nights). Real value, zero pretension. Book direct on WhatsApp.";

  return {
    metadataBase: new URL("https://www.calcuttabackpackers.com"),
    title,
    description,
    keywords: [
      "hostel kolkata",
      "best hostel kolkata",
      "budget hostel kolkata",
      "cheap hostel kolkata",
      "backpackers hostel kolkata",
      "poshtel kolkata",
      "hostel near sudder street",
      "hostel near park street",
      "dorms kolkata",
      "private room kolkata cheap",
      "solo travel kolkata",
      "kolkata street food tour",
      "heritage walk kolkata",
      "things to do in kolkata",
      "backpacking india",
      "gen z travel kolkata",
      "affordable stay kolkata",
      "social hostel india",
    ],
    icons: {
      icon: logoUrl,
      shortcut: logoUrl,
      apple: logoUrl,
    },
    openGraph: {
      title,
      description,
      url: "https://www.calcuttabackpackers.com",
      siteName: "Calcutta Backpackers",
      images: [
        {
          url: "/images/Community.webp",
          width: 1200,
          height: 630,
        }
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/Community.webp"],
    }
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings().catch(() => null);
  const testimonials = await getTestimonials().catch(() => []);

  const structuredData: any = {
    "@context": "https://schema.org",
    "@type": "Hostel",
    "name": "Calcutta Backpackers",
    "description": "A budget-friendly hostel in Kolkata offering a poshtel-style stay - AC dorms, private rooms, and curated WanderXP local experiences for backpackers and solo travelers.",
    "url": "https://www.calcuttabackpackers.com",
    "image": "https://www.calcuttabackpackers.com/images/Community.webp",
    "priceRange": settings?.priceRangeLow && settings?.priceRangeHigh
      ? `₹${settings.priceRangeLow} - ₹${settings.priceRangeHigh}`
      : "₹399 - ₹4,599",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "6/27a, Pashupati Bhattacharya Road",
      "addressLocality": "Kolkata",
      "postalCode": "700034",
      "addressCountry": "IN"
    },
    "telephone": "+91-98754-32441",
    "email": "bookingcalcuttabackpackers@gmail.com",
    "checkinTime": settings?.checkInTime || "14:00",
    "checkoutTime": settings?.checkOutTime || "11:00",
    "amenityFeature": (settings?.coreAmenities && settings.coreAmenities.length > 0
      ? settings.coreAmenities
      : ["Free WiFi", "Air Conditioning", "Lockers", "Guided Local Experiences"]
    ).map((name) => ({ "@type": "LocationFeatureSpecification", name, value: true })),
  };

  // Publish review markup only when there is real testimonial content.
  if (testimonials.length > 0) {
    const avgRating = testimonials.reduce((sum, t) => sum + (t.rating || 0), 0) / testimonials.length;
    structuredData.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": avgRating.toFixed(1),
      "reviewCount": testimonials.length,
      "bestRating": "5",
      "worstRating": "1",
    };

    structuredData.review = testimonials.slice(0, 10).map((testimonial) => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": testimonial.guestName,
      },
      "datePublished": testimonial.reviewDate || undefined,
      "reviewBody": testimonial.quote,
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": testimonial.rating,
        "bestRating": "5",
        "worstRating": "1",
      },
    }));
  }

  // Only add geo/neighborhood fields if actually set in Sanity - fabricating
  // coordinates would be worse than omitting them.
  if (settings?.latitude && settings?.longitude) {
    structuredData.geo = {
      "@type": "GeoCoordinates",
      "latitude": settings.latitude,
      "longitude": settings.longitude,
    };
  }
  if (settings?.primaryNeighborhood) {
    structuredData.address.addressRegion = settings.primaryNeighborhood;
  }
  if (settings?.googleMapsUrl) {
    structuredData.hasMap = settings.googleMapsUrl;
  }

  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-cream text-dark">
        <Toaster 
          position="top-right" 
          toastOptions={{
            style: {
              background: '#1a1a1a',
              color: '#fff',
              borderRadius: '16px',
              padding: '16px 20px',
              fontSize: '14px',
            },
          }} 
        />
        <SiteChrome>
          <main className="flex-grow">{children}</main>
        </SiteChrome>
        <Analytics />
      </body>
    </html>
  );
}
