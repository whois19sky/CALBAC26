"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Testimonial } from "@/lib/types";

// Shown briefly while testimonials load, and as a fallback if the database is ever empty.
const fallbackTestimonials = [
  {
    quote:
      "The most beautiful hostel I've ever stayed in. It feels like a boutique hotel but with the warmth and community of a backpacker lodge. Absolutely world-class.",
    guest_name: "Sarah Mitchell",
    origin: "Melbourne, Australia",
  },
];

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Pick<Testimonial, "quote" | "guest_name" | "origin">[]>(
    fallbackTestimonials
  );
  const [active, setActive] = useState(0);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("testimonials")
        .select("quote, guest_name, origin")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (data && data.length > 0) {
        setTestimonials(data);
      }
    };
    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <section className="py-24 md:py-40 bg-white relative overflow-hidden">
      {/* Decorative Blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-waabi-green/20 rounded-full mix-blend-multiply filter blur-[120px] opacity-60 pointer-events-none" />

      <div className="max-w-[1000px] mx-auto px-6 md:px-10 relative z-10 text-center">
        <Quote size={40} className="text-waabi-green-dark mx-auto mb-12 opacity-50" />

        <div className="relative min-h-[250px] md:min-h-[300px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.05, y: -20 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <blockquote className="heading-lg font-serif text-dark leading-snug mb-10">
                &ldquo;{testimonials[active].quote}&rdquo;
              </blockquote>

              <div className="flex flex-col items-center gap-2">
                <p className="font-bold text-dark uppercase tracking-widest text-sm">
                  {testimonials[active].guest_name}
                </p>
                <p className="text-dark/50 text-sm">
                  {testimonials[active].origin}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-3 mt-12">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-500 ${
                active === i
                  ? "w-8 bg-waabi-green-dark"
                  : "w-2 bg-dark/10 hover:bg-dark/30"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
