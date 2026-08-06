"use client";

import { usePathname } from "next/navigation";
import { MotionConfig } from "framer-motion";
import Navbar from "./Navbar";
import Footer from "./Footer";

/**
 * Renders the public-facing Navbar/Footer around every page EXCEPT /admin
 * routes, which have their own separate sidebar layout. This lives in the
 * root layout so Navbar/Footer persist across client-side navigations
 * instead of unmounting and remounting (with their entrance animations
 * replaying) on every single page change.
 *
 * Also wraps everything in MotionConfig(reducedMotion="user"), so every
 * framer-motion animation site-wide - entrance fades, scroll parallax, the
 * marquee, etc. - automatically collapses to instant for visitors with
 * "reduce motion" set at the OS level. CSS transitions/animations already
 * respected that setting (see globals.css); this closes the gap for the
 * JS-driven ones.
 */
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <MotionConfig reducedMotion="user">
      <Navbar />
      {children}
      <Footer />
    </MotionConfig>
  );
}
