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

// One set of words, rendered twice back-to-back. Animating exactly -50% of
// that combined width (instead of a guessed pixel value like -1000px) means
// the point where the animation loops back to 0% always lines up perfectly
// with real content, regardless of viewport width or font size - no visible
// jump or gap, which the previous fixed-offset version could show.
function WordSet() {
  return (
    <div className="flex items-center gap-8 md:gap-16 pr-8 md:pr-16 shrink-0">
      {words.map((word, i) => (
        <div key={i} className="flex items-center gap-8 md:gap-16 shrink-0">
          <span className="font-sans text-xl md:text-2xl font-bold tracking-widest text-dark uppercase">
            {word}
          </span>
          <span className="w-2 h-2 rounded-full bg-dark/20" />
        </div>
      ))}
    </div>
  );
}

export default function MarqueeStrip() {
  return (
    <div className="bg-waabi-green-dark py-4 md:py-6 overflow-hidden flex whitespace-nowrap border-y border-dark/10 relative w-full">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 25,
        }}
        className="flex w-max will-change-transform"
      >
        <WordSet />
        <WordSet />
      </motion.div>
    </div>
  );
}
