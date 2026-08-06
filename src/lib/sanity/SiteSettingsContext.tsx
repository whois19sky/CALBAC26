"use client";

import { createContext, useContext } from "react";
import type { SanitySiteSettings } from "./queries";

/**
 * Site Settings are fetched exactly once, server-side, in the root layout -
 * then handed down through this context. Before this existed, every
 * component that needed the logo/contact info/hero content (Navbar, Footer,
 * HeroSection, etc.) independently called useSiteSettings(), which fetched
 * the same singleton document from Sanity again from the browser - on a
 * single page load that meant 3-4 duplicate network requests for identical
 * data. Now there's exactly one fetch, done on the server, shared everywhere.
 */
const SiteSettingsContext = createContext<SanitySiteSettings | null>(null);

export function SiteSettingsProvider({
  value,
  children,
}: {
  value: SanitySiteSettings | null;
  children: React.ReactNode;
}) {
  return (
    <SiteSettingsContext.Provider value={value}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettingsContext() {
  return useContext(SiteSettingsContext);
}
