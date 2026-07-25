"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const stats = [
  { value: 15000, suffix: "+", label: "Happy Guests" },
  { value: 4.9, suffix: "/5", label: "Google Rating", decimals: 1 },
  { value: 50, suffix: "+", label: "Countries Represented" },
  { value: 6, suffix: "", label: "Years of Hospitality" },
];

function useCountUp(target: number, decimals = 0, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(easeProgress * target);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [isInView, target, duration]);

  return { count, ref };
}

export default function StatsCounter() {
  return (
    <section className="py-24 md:py-32 bg-waabi-bg">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="w-full h-px bg-dark/10 mb-16 md:mb-24" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, i) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const { count, ref } = useCountUp(stat.value, stat.decimals || 0);

            return (
              <motion.div
                key={stat.label}
                ref={ref}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="text-center"
              >
                <div className="font-serif text-5xl md:text-7xl font-medium text-dark mb-4">
                  {stat.decimals ? count.toFixed(stat.decimals) : Math.floor(count)}
                  <span className="text-waabi-green-dark">{stat.suffix}</span>
                </div>
                <p className="label-upper text-dark/50">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="w-full h-px bg-dark/10 mt-16 md:mt-24" />
      </div>
    </section>
  );
}
