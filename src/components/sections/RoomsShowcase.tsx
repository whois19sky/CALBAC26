"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Room } from "@/lib/types";

const WHATSAPP_LINK = "https://wa.me/919875432441?text=Hi%20Calcutta%20Backpackers!%20I'm%20interested%20in%20booking%20a%20stay.";

export default function RoomsShowcase() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("rooms")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (data && data.length > 0) setRooms(data);
      setLoading(false);
    };
    fetchRooms();
  }, []);

  if (loading) {
    return (
      <section id="rooms" className="py-24 md:py-40 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 flex justify-center">
          <div className="w-8 h-8 border-4 border-waabi-green border-t-waabi-green-dark rounded-full animate-spin" />
        </div>
      </section>
    );
  }

  if (rooms.length === 0) return null;

  const active = rooms[activeIndex] || rooms[0];

  return (
    <section id="rooms" className="py-24 md:py-40 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16 md:mb-24">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="label-upper text-waabi-green-dark block mb-4"
          >
            Accommodations
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="heading-xl font-serif text-dark mb-10"
          >
            Sleep well. <span className="text-waabi-green-dark italic">Spend less.</span>
          </motion.h2>

          {/* Room tabs */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-waabi-bg p-1.5 rounded-full flex gap-1 shadow-sm border border-dark/5 flex-wrap justify-center"
          >
            {rooms.map((room, i) => (
              <button
                key={room.id}
                onClick={() => setActiveIndex(i)}
                aria-label={`View ${room.name}`}
                className={`px-6 md:px-8 py-3 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 ${
                  activeIndex === i
                    ? "bg-white text-dark shadow-sm"
                    : "text-dark/50 hover:text-dark"
                }`}
              >
                {room.name}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Content */}
        <div className="waabi-card bg-waabi-bg p-6 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12"
            >
              <div className="relative h-[350px] md:h-[500px] rounded-2xl overflow-hidden">
                <Image
                  src={active.images?.[0] || "/images/Community.webp"}
                  alt={`${active.name} at Calcutta Backpackers`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
              </div>

              <div className="flex flex-col justify-center py-4 md:py-8 md:pr-8">
                <span className="inline-block px-4 py-1.5 bg-waabi-green/30 text-waabi-green-dark text-xs font-bold uppercase tracking-widest rounded-full w-fit mb-6">
                  {active.tagline}
                </span>
                <h3 className="heading-lg font-serif mb-6 text-dark">{active.name}</h3>
                <p className="text-dark/70 leading-relaxed text-lg mb-10">
                  {active.description}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-12">
                  {(active.features || []).map((f) => (
                    <div key={f} className="flex items-center gap-3 text-sm text-dark/80 font-medium">
                      <div className="w-6 h-6 rounded-full bg-waabi-green flex items-center justify-center flex-shrink-0">
                        <Check size={14} className="text-dark" />
                      </div>
                      {f}
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6 pt-8 border-t border-dark/10">
                  <div>
                    <span className="text-sm text-dark/50 font-medium block">Starting from</span>
                    <span className="text-2xl font-serif font-bold text-dark">₹{active.price_per_night.toLocaleString("en-IN")}/night</span>
                  </div>
                  <Link
                    href={WHATSAPP_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary sm:ml-auto w-full sm:w-auto shadow-lg"
                  >
                    Check Availability <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
