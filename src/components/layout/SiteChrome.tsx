"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

/**
 * Renders the public-facing Navbar/Footer around every page EXCEPT /admin
 * routes, which have their own separate sidebar layout. This lives in the
 * root layout so Navbar/Footer persist across client-side navigations
 * instead of unmounting and remounting (with their entrance animations
 * replaying) on every single page change.
 */
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
