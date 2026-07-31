"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Check } from "lucide-react";
import { urlFor } from "@/lib/sanity";
import type { SanityRoom } from "@/lib/sanity/queries";

// Truncates at the last complete word within the limit, instead of CSS
// line-clamp which cuts wherever a line happens to end, often mid-word.
function truncateAtWord(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");
  return (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated) + "…";
}

export default function RoomBrowser({
  rooms,
  selectedRoom,
  onSelectRoom,
}: {
  rooms: SanityRoom[];
  selectedRoom: SanityRoom | null;
  onSelectRoom: (room: SanityRoom) => void;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = rooms[activeIndex] || rooms[0];
  const isActiveSelected = selectedRoom?._id === active._id;

  return (
    <div>
      {/* Room tabs */}
      <div className="bg-waabi-bg p-1.5 rounded-full flex gap-1 shadow-sm border border-dark/5 overflow-x-auto mb-6 scrollbar-hide">
        {rooms.map((room, i) => (
          <button
            key={room._id}
            type="button"
            onClick={() => setActiveIndex(i)}
            className={`px-4 md:px-5 py-2.5 rounded-full text-xs md:text-sm font-semibold tracking-wide transition-all duration-300 relative whitespace-nowrap flex-shrink-0 ${
              activeIndex === i ? "bg-white text-dark shadow-sm" : "text-dark/50 hover:text-dark"
            }`}
          >
            {room.name}
            {selectedRoom?._id === room._id && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-waabi-green-dark flex items-center justify-center">
                <Check size={10} className="text-white" />
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Active room detail card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active._id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="waabi-card bg-waabi-bg p-4 md:p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative h-[220px] md:h-[280px] rounded-2xl overflow-hidden">
              <Image
                src={active.images?.[0] ? urlFor(active.images[0]).width(700).url() : "/images/Community.webp"}
                alt={active.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            <div className="flex flex-col justify-center">
              <span className="inline-block px-3 py-1 bg-waabi-green/30 text-waabi-green-dark text-xs font-bold uppercase tracking-widest rounded-full w-fit mb-3">
                {active.tagline}
              </span>
              <p className="text-dark/70 text-sm leading-relaxed mb-4">{truncateAtWord(active.description, 140)}</p>

              <div className="grid grid-cols-2 gap-2 mb-4">
                {(active.features || []).slice(0, 4).map((f) => (
                  <div key={f} className="flex items-center gap-2 text-xs text-dark/70 font-medium">
                    <Check size={12} className="text-waabi-green-dark flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-dark/10">
                <div>
                  <span className="text-xs text-dark/50 font-medium block">Per night</span>
                  <span className="text-xl font-serif font-bold text-dark">₹{active.pricePerNight.toLocaleString("en-IN")}</span>
                </div>
                <button
                  type="button"
                  onClick={() => onSelectRoom(active)}
                  className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                    isActiveSelected
                      ? "bg-waabi-green-dark text-white"
                      : "bg-dark text-white hover:bg-waabi-green-dark"
                  }`}
                >
                  {isActiveSelected ? "✓ Selected" : "Select This Room"}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
