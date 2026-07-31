"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSiteSettings, urlFor, hasValidImage } from "@/lib/sanity";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "The Nest XP", href: "/the-nest" },
  { name: "WanderXP", href: "/wanderxp" },
  { name: "The Social", href: "/the-social" },
  { name: "Blog", href: "/blog" },
  { name: "Check-In", href: "/checkin" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Prevent background scroll while the mobile menu is open, and close the
  // menu automatically if the window is resized up to desktop width.
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const { settings } = useSiteSettings();
  const logoSrc = hasValidImage(settings?.logo) ? urlFor(settings!.logo).width(96).url() : "/images/logo.png";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // On non-home pages, navbar should always have a background
  const hasBackground = isScrolled || !isHomePage;

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] p-4 md:p-6 transition-all duration-500 will-change-transform">
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`w-full max-w-[1400px] mx-auto rounded-full transition-all duration-500 ${
          hasBackground ? "glass-nav shadow-lg" : "bg-transparent"
        }`}
      >
        <div className="px-6 md:px-8 flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-white">
              <Image
                src={logoSrc}
                alt="Calcutta Backpackers"
                fill
                sizes="48px"
                className="object-contain p-1"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className={`font-serif text-base font-bold leading-tight tracking-tight transition-colors ${hasBackground ? 'text-dark' : 'text-white'}`}>
                Calcutta
              </span>
              <span className={`text-[10px] uppercase tracking-[0.2em] font-bold transition-colors ${hasBackground ? 'text-waabi-green-dark' : 'text-waabi-green'}`}>
                Backpackers
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-[12px] font-bold uppercase tracking-[0.1em] transition-colors duration-300 relative group ${
                  pathname === link.href 
                    ? (hasBackground ? 'text-waabi-green-dark' : 'text-waabi-green')
                    : (hasBackground ? 'text-dark/70 hover:text-dark' : 'text-white/70 hover:text-white')
                }`}
              >
                {link.name}
                <span className={`absolute -bottom-1 left-0 h-[2px] transition-all duration-500 ${
                  pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'
                } ${hasBackground ? 'bg-waabi-green-dark' : 'bg-waabi-green'}`} />
              </Link>
            ))}
          </nav>

          {/* CTA + Mobile Toggle */}
          <div className="flex items-center gap-4">
            <Link
              href="/booking"
              className={`hidden md:inline-flex items-center justify-center gap-2 py-2.5 px-6 text-xs font-semibold rounded-full transition-all duration-300 ${
                hasBackground 
                  ? 'bg-waabi-green text-dark hover:bg-waabi-green-dark hover:shadow-lg'
                  : 'bg-white/15 backdrop-blur-md text-white border border-white/20 hover:bg-white/25'
              }`}
            >
              Book Now
            </Link>
            <button
              className={`md:hidden p-3 rounded-full shadow-sm transition-colors flex items-center justify-center ${hasBackground ? 'text-dark bg-white' : 'text-white bg-white/15 backdrop-blur-md'}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-24 left-4 right-4 z-40 bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl flex flex-col items-center gap-6 border border-dark/5 will-change-transform"
          >
            {navLinks.map((link, i) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
              >
                <Link
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`font-serif text-3xl font-medium transition-colors ${
                    pathname === link.href ? 'text-waabi-green-dark' : 'text-dark hover:text-waabi-green-dark'
                  }`}
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: navLinks.length * 0.05, duration: 0.4 }}
              className="w-full mt-4"
            >
              <Link
                href="/booking"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-primary w-full shadow-lg"
              >
                Book Now
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
