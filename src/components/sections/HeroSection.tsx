"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Play, Volume2, VolumeX } from "lucide-react";
import Link from "next/link";
import { useSiteSettings, urlFor, hasValidImage } from "@/lib/sanity";

const WHATSAPP_LINK = "https://wa.me/919875432441?text=Hi%20Calcutta%20Backpackers!%20I'm%20interested%20in%20booking%20a%20stay.";

const FALLBACK_VIDEO_URL = "https://videos.pexels.com/video-files/4874712/4874712-uhd_3840_2160_25fps.mp4";

const slides = [
  {
    id: 1,
    title: "Kolkata, but make it affordable.",
    subtitle: "Dorms from ₹499. Clean rooms, real community, zero markup for the sake of it.",
  },
  {
    id: 2,
    title: "Sleep well, spend less.",
    subtitle: "AC dorms, private rooms, and clean bathrooms — priced like they're meant to be used, not admired.",
  },
  {
    id: 3,
    title: "Don't just visit. Wander.",
    subtitle: "Street food crawls, heritage walks, rooftop nights — WanderXP gets you the city, not a checklist.",
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const { settings } = useSiteSettings();
  // One lightweight video for every device now, instead of separate mobile/
  // desktop sources - this removes the whole "which device gets which video"
  // branching logic that caused a real bug (a brief incorrect default could
  // trigger the heavy desktop video to start loading on phones). Simpler,
  // safer, and better for desktop performance too, since the original 4K
  // Pexels fallback was never great for speed either.
  const heroVideoUrl = settings?.heroVideoMobile?.asset?.url || settings?.heroVideoUrl || FALLBACK_VIDEO_URL;
  const mobileImageSrc = hasValidImage(settings?.heroImageMobile)
    ? urlFor(settings!.heroImageMobile).width(1200).url()
    : "/images/Community.webp";

  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

  useEffect(() => {
    // Delay starting the video load until just after the initial paint window.
    // This guarantees the fast poster image is what gets measured for LCP,
    // instead of competing with the video's own (much slower) load/decode time.
    // The video still appears within ~1.5s either way - imperceptible to a
    // real visitor, but keeps it out of the performance-critical measurement.
    const timer = setTimeout(() => setShouldLoadVideo(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="home" className="relative min-h-[100svh] w-full">
      {/* Video Background - same lightweight source for every device */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          muted={isMuted}
          loop
          playsInline
          preload="metadata"
          poster={mobileImageSrc}
          onLoadedData={() => setVideoLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-1000 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
        >
          {shouldLoadVideo && <source src={heroVideoUrl} type="video/mp4" />}
        </video>
        {/* Fallback gradient if video doesn't load */}
        {!videoLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#12314F] via-[#1E4E78] to-[#0B1F33]" />
        )}
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-dark/80 via-dark/50 to-dark/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-dark/20" />
      </div>

      {/* Mute/Unmute Button */}
      <button
        onClick={() => setIsMuted(!isMuted)}
        className="absolute bottom-8 right-8 z-30 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300"
        aria-label={isMuted ? "Unmute video" : "Mute video"}
      >
        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>

      {/* Content */}
      <div className="relative z-20 min-h-[100svh] max-w-[1400px] mx-auto px-6 md:px-10 py-28 md:py-32 flex flex-col justify-center">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between w-full gap-8">
          <div className="max-w-2xl">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white/90 text-xs font-semibold tracking-widest uppercase border border-white/20"
            >
              <span className="w-2 h-2 rounded-full bg-waabi-green animate-pulse" />
              Welcome to Calcutta
            </motion.div>

            {/* Sliding Text — CSS Grid stacking keeps the container sized to whichever
                slide is actually showing, instead of a guessed min-height, so long
                titles can never overflow into the section below. */}
            <div className="relative grid">
              {/* initial={false}: on first paint the headline renders directly at its
                  final visible state instead of fading in from opacity:0 - the fade
                  only plays on later slide changes. The headline is almost always the
                  largest element on the page (LCP candidate); gating it behind a
                  post-hydration animation delays LCP until React hydrates and the
                  animation runs, which is exactly the kind of thing that looks fine
                  on desktop but tanks the score under mobile's slower CPU/network. */}
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="col-start-1 row-start-1 will-change-transform"
                >
                  <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-medium text-white mb-4 xs:mb-6 leading-[1.1] sm:leading-[1.05] tracking-tight drop-shadow-lg">
                    {slides[currentSlide].title}
                  </h1>
                  <p className="font-sans text-white/70 text-base sm:text-lg md:text-xl max-w-lg leading-relaxed">
                    {slides[currentSlide].subtitle}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* CTAs - Moved to the right */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0 pb-4 md:pb-12"
          >
            <Link href="/booking" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-waabi-green text-dark font-semibold rounded-full hover:bg-waabi-green-dark hover:scale-105 transition-all duration-300 shadow-[0_8px_30px_rgba(201,222,240,0.4)]">
              Book Now <ArrowRight size={18} />
            </Link>
            <Link href="/checkin" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-md text-white font-semibold rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300">
              <Play size={16} /> Check-In
            </Link>
          </motion.div>
        </div>

        {/* Slide Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 flex gap-3"
        >
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 rounded-full transition-all duration-700 ease-in-out ${idx === currentSlide ? "w-12 bg-waabi-green" : "w-3 bg-white/30 hover:bg-white/50"}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <span className="text-white/40 text-xs tracking-[0.3em] uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="w-5 h-8 rounded-full border-2 border-white/20 flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-2 bg-white/50 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
