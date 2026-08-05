"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Mail, ArrowRight } from "lucide-react";
import { useSiteSettings, urlFor, hasValidImage } from "@/lib/sanity";

export default function Footer() {
  const { settings } = useSiteSettings();
  const logoSrc = hasValidImage(settings?.logo) ? urlFor(settings!.logo).width(112).url() : "/images/CB Logo new.png";

  return (
    <motion.footer 
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative max-w-6xl mx-auto w-[95%] mb-10 bg-waabi-green/90 backdrop-blur-xl border border-dark/10 rounded-3xl p-8 md:p-12 shadow-2xl flex flex-col will-change-transform"
    >
      <div className="flex flex-col md:flex-row justify-between gap-12 mb-12">
        {/* Brand Section */}
        <div className="flex flex-col gap-6 md:w-1/3">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center p-1 overflow-hidden shadow-sm border border-dark/5 flex-shrink-0">
              <Image key={logoSrc} src={logoSrc} alt="CB Logo" width={56} height={56} className="object-contain animate-[fadeIn_0.4s_ease-out]" />
            </div>
            <div>
              <h3 className="text-dark font-serif text-2xl">Calcutta Backpackers</h3>
              <p className="text-dark/90 text-sm mt-1">Kolkata's Best Value Stay</p>
            </div>
          </div>
          
          <div className="flex flex-col gap-3 mt-2">
            <div className="flex items-center gap-3 text-dark/90 text-sm">
              <MapPin size={18} className="text-dark" />
              <span>6/27a, Pashupati Bhattacharya Road, Kolkata 700034</span>
            </div>
            <div className="flex items-center gap-3 text-dark/90 text-sm">
              <Mail size={18} className="text-dark" />
              <span>bookingcalcuttabackpackers@gmail.com</span>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="flex flex-col md:flex-row gap-12 md:gap-24">
          <div className="flex flex-col gap-4">
            <h4 className="text-dark font-semibold tracking-widest uppercase text-xs">Quick Links</h4>
            <Link href="/the-nest" className="text-dark/90 hover:text-dark transition-colors font-medium">The Nest XP</Link>
            <Link href="/wanderxp" className="text-dark/90 hover:text-dark transition-colors font-medium">WanderXP Experiences</Link>
            <Link href="/booking" className="text-dark/90 hover:text-dark transition-colors font-medium">Book a Stay</Link>
            <Link href="/checkin" className="text-dark/90 hover:text-dark transition-colors font-medium">Web Check-in</Link>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-dark font-semibold tracking-widest uppercase text-xs">Explore</h4>
            <Link href="/the-social" className="text-dark/90 hover:text-dark transition-colors font-medium">The Social</Link>
            <Link href="/blog" className="text-dark/90 hover:text-dark transition-colors font-medium">Blog</Link>
            <a href="https://www.instagram.com/calcuttabackpackers/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-dark/90 hover:text-dark transition-colors font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              Instagram
            </a>
            <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-dark/90 hover:text-dark transition-colors font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              Facebook
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="pt-8 border-t border-dark/10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-dark/60 text-sm font-medium">
          © {new Date().getFullYear()} Calcutta Backpackers — Kolkata's Best Value Hostel for Backpackers
        </div>

        <Link
          href="/booking"
          className="bg-waabi-bg text-dark px-8 py-4 rounded-full font-semibold hover:scale-105 hover:shadow-lg transition-all duration-300 flex items-center gap-2"
        >
          Book Now <ArrowRight size={18} />
        </Link>
      </div>
    </motion.footer>
  );
}
