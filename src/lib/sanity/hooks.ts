"use client";

import { useState, useEffect } from "react";
import { getSiteSettings } from "./queries";
import type { SanitySiteSettings } from "./queries";

/**
 * Fetches the singleton Site Settings document from Sanity (logo, hero content,
 * contact info, per-page SEO). Returns null while loading or if nothing has been
 * set up in Sanity yet - callers should fall back to sensible defaults in that case.
 */
export function useSiteSettings() {
  const [settings, setSettings] = useState<SanitySiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchSettings = async () => {
      try {
        const data = await getSiteSettings();
        if (!cancelled) setSettings(data);
      } catch (err) {
        console.error("Failed to fetch site settings from Sanity:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchSettings();
    return () => { cancelled = true; };
  }, []);

  return { settings, loading };
}
