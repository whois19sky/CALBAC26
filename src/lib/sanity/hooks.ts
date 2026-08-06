"use client";

import { useSiteSettingsContext } from "./SiteSettingsContext";

/**
 * Returns the singleton Site Settings document (logo, hero content, contact
 * info, per-page SEO). Backed by SiteSettingsContext, which is populated once
 * server-side in the root layout - so this never triggers its own network
 * request. `loading` is kept in the return shape for backwards compatibility
 * with existing callers, but is always `false`: the data is already present
 * by the time any client component renders.
 */
export function useSiteSettings() {
  const settings = useSiteSettingsContext();
  return { settings, loading: false };
}
