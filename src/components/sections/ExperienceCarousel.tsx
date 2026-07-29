"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Compass } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getExperiences, urlFor } from "@/lib/sanity";

const fallbackExperiences = [
  {
    title: "Street Food Crawl",
    category: "Culinary",
    desc: "Kati rolls, phuchka, cutting chai at dawn — the food Kolkata actually eats, not what's in the guidebook. WanderXP takes you to the stalls locals queue for.",
    img: "/images/Commonspace.webp",
  },
  {
    title: "Heritage Walk",
    category: "Culture",
    desc: "Crumbling colonial mansions, hidden courtyards, and the stories behind the City of Joy — on foot, with someone who actually grew up here.",
    img: "/images/Community.webp",
  },
  {
    title: "The Social Feed",
    category: "Community",
    desc: "Rooftop music nights, 5pm chai sessions, communal dinners with strangers who won't stay strangers. The stuff that makes a hostel worth staying at.",
    img: "/images/Dorm1.webp",
  },
];

export default function ExperienceCarousel() {
  const [experiences, setExperiences] = useState(fallbackExperiences);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const data = await getExperiences();
        if (data && data.length > 0) {
          setExperiences(
            data.map(e => ({
              title: e.title,
              category: e.category,
              desc: e.description,
              img: e.image ? urlFor(e.image).width(900).url() : "/images/Commonspace.webp",
            }))
          );
        }
      } catch (err) {
        console.error("Failed to fetch experiences from Sanity:", err);
      }
    };
    fetchExperiences();
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);

  return (
    <section id="experiences" className="py-24 md:py-40 bg-white overflow-hidden" ref={containerRef}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 md:mb-24 gap-8">
          <div className="max-w-2xl">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="label-upper text-waabi-green-dark block mb-4 flex items-center gap-2"
            >
              <Compass size={16} /> Beyond the bed
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="heading-xl font-serif text-dark"
            >
              WanderXP <span className="text-waabi-green-dark italic">Experiences.</span>
            </motion.h2>
          </div>
          <Link href="/wanderxp" className="btn-outline hidden md:flex">
            See All Experiences
          </Link>
        </div>

        {/* Horizontal scroll section */}
        <div className="relative">
          <motion.div style={{ x }} className="flex gap-6 md:gap-10 w-max">
            {experiences.map((exp, i) => (
              <motion.div
                key={exp.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="w-[300px] md:w-[450px] waabi-card group"
              >
                <div className="relative h-[400px] md:h-[550px] w-full overflow-hidden">
                  <Image
                    src={exp.img}
                    alt={exp.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-dark/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider rounded-full w-fit mb-4 border border-white/30">
                      {exp.category}
                    </span>
                    <h3 className="font-serif text-2xl md:text-3xl text-white mb-3">
                      {exp.title}
                    </h3>
                    <p className="text-white/80 text-sm md:text-base leading-relaxed mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                      {exp.desc}
                    </p>
                    <Link
                      href="/wanderxp"
                      className="w-12 h-12 rounded-full bg-waabi-green text-dark flex items-center justify-center hover:scale-110 transition-transform duration-300 opacity-0 group-hover:opacity-100"
                    >
                      <ArrowRight size={20} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <Link href="/wanderxp" className="btn-outline mt-12 flex md:hidden w-full">
          See All Experiences
        </Link>
      </div>
    </section>
  );
}
