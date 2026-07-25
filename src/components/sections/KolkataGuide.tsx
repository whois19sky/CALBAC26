"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const WHATSAPP_LINK = "https://wa.me/919875432441?text=Hi%20Calcutta%20Backpackers!%20I'm%20interested%20in%20booking%20a%20stay.";

const thingsToDo = [
  {
    title: "The Ultimate Street Food Crawl",
    description: "Phuchka, kathi rolls, and cutting chai at dawn — the real Kolkata street food scene, not the tourist version. We take you to the stalls near New Market that locals have queued at for decades.",
    image: "/images/Commonspace.webp",
    color: "bg-waabi-green/40",
  },
  {
    title: "Heritage & Architecture Walks",
    description: "Crumbling colonial mansions, hidden courtyards, and North Kolkata's grand old palaces — the free walking tour every Gen Z traveler's Instagram grid is missing.",
    image: "/images/Community.webp",
    color: "bg-waabi-bg",
  },
  {
    title: "The Social Evening Events",
    description: "Rooftop music nights, 5pm chai sessions, and game nights with fellow travelers — daily, free, and honestly the best part of staying somewhere that actually wants you to hang out, not just sleep.",
    image: "/images/Dorm1.webp",
    color: "bg-white",
  },
];

export default function KolkataGuide() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <section id="guide" className="bg-waabi-bg text-dark relative" ref={containerRef}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 pt-24 md:pt-40 pb-20">
        
        {/* Header */}
        <div className="mb-20 md:mb-32">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="label-upper text-waabi-green-dark block mb-4"
          >
            City Guide
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="heading-xl font-serif text-dark max-w-2xl"
          >
            Things to do in <span className="italic text-waabi-green-dark">Kolkata.</span>
          </motion.h2>
        </div>

        {/* Stacked Cards */}
        <div className="relative h-[250vh]">
          {thingsToDo.map((item, i) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const progress = useTransform(
              scrollYProgress, 
              [i * 0.33, (i + 1) * 0.33], 
              [0, 1]
            );
            
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const scale = useTransform(progress, [0, 1], [0.95, 1]);
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const y = useTransform(progress, [0, 1], [50, 0]);
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const opacity = useTransform(progress, [0, 0.5, 1], [0, 1, 1]);

            return (
              <motion.div
                key={item.title}
                style={{ scale, y, opacity }}
                className={`sticky top-32 w-full h-[500px] md:h-[600px] rounded-[32px] overflow-hidden mb-8 ${item.color} shadow-xl flex flex-col md:flex-row will-change-transform border border-dark/5`}
              >
                <div className="w-full md:w-1/2 h-[50%] md:h-full relative">
                  <Image src={item.image} alt={item.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                </div>
                
                <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center">
                  <h3 className="heading-lg font-serif text-dark mb-6 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-dark/70 text-lg mb-10 leading-relaxed max-w-md">
                    {item.description}
                  </p>
                  <Link href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="btn-primary w-fit">
                    Book this experience <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
