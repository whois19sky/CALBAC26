"use client";

import { motion } from "framer-motion";

const words = [
  "No Hidden Fees",
  "WanderXP Experiences",
  "Heritage Walks",
  "The Social Feed",
  "Best Value in Kolkata",
  "Kolkata",
  "Backpackers",
  "Capsule Dorms",
];

export default function MarqueeStrip() {
  return (
    <div className="bg-waabi-green-dark py-4 md:py-6 overflow-hidden flex whitespace-nowrap border-y border-dark/10 relative w-full">
      <motion.div
        animate={{ x: [0, -1000] }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 25,
        }}
        className="flex gap-8 md:gap-16 pr-8 md:pr-16 w-max will-change-transform"
      >
        {[...words, ...words, ...words, ...words].map((word, i) => (
          <div key={i} className="flex items-center gap-8 md:gap-16 shrink-0">
            <span className="font-sans text-xl md:text-2xl font-bold tracking-widest text-dark uppercase">
              {word}
            </span>
            <span className="w-2 h-2 rounded-full bg-dark/20" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
