import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.calcuttabackpackers.com"),
  title: "Calcutta Backpackers | Best Poshtel & Budget Hostel in Kolkata",
  description:
    "Kolkata's top-rated poshtel — stylish dorms from ₹499/night, private rooms, free wifi, and WanderXP experiences (street food crawls, heritage walks, rooftop nights). Real value, zero pretension. Book direct on WhatsApp.",
  keywords: [
    "poshtel kolkata",
    "hostel kolkata",
    "budget hostel kolkata",
    "cheap hostel kolkata",
    "backpackers hostel kolkata",
    "best hostel kolkata",
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
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
  openGraph: {
    title: "Calcutta Backpackers | Kolkata's Best Value Poshtel",
    description: "Dorms from ₹499. Private rooms from ₹1,999. Free wifi, real community, and WanderXP experiences that don't feel like a tour. This is Kolkata, done right — and done affordable.",
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
    title: "Calcutta Backpackers | Kolkata's Best Value Poshtel",
    description: "Dorms from ₹499. Free wifi, real community, and WanderXP experiences worth posting about. This is Kolkata, done right — and done affordable.",
    images: ["/images/Community.webp"],
  }
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  "name": "Calcutta Backpackers",
  "description": "A value-for-money poshtel in Kolkata offering dorms, private rooms, and curated WanderXP local experiences for backpackers and solo travelers.",
  "url": "https://www.calcuttabackpackers.com",
  "image": "https://www.calcuttabackpackers.com/images/Community.webp",
  "priceRange": "₹399 - ₹3,499",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "6/27a, Pashupati Bhattacharya Road",
    "addressLocality": "Kolkata",
    "postalCode": "700034",
    "addressCountry": "IN"
  },
  "telephone": "+91-98754-32441",
  "email": "bookingcalcuttabackpackers@gmail.com",
  "checkinTime": "14:00",
  "checkoutTime": "11:00",
  "amenityFeature": [
    { "@type": "LocationFeatureSpecification", "name": "Free WiFi", "value": true },
    { "@type": "LocationFeatureSpecification", "name": "Air Conditioning", "value": true },
    { "@type": "LocationFeatureSpecification", "name": "Lockers", "value": true },
    { "@type": "LocationFeatureSpecification", "name": "Guided Local Experiences", "value": true }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
        <main className="flex-grow">{children}</main>
      </body>
    </html>
  );
}
