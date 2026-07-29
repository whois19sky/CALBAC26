"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, MapPin, Compass } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getExperiences, urlFor } from "@/lib/sanity";
import { useEffect, useState } from "react";
import type { SanityExperience } from "@/lib/sanity/queries";

const categories = ["All", "Culinary", "Culture", "Community", "Adventure"];

export default function WanderXPPage() {
  const [experiences, setExperiences] = useState<SanityExperience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const exps = await getExperiences();
        if (exps) setExperiences(exps);
      } catch (err) {
        console.error("Failed to fetch experiences from Sanity:", err);
      }
      setLoading(false);
    };

    fetchData();
  }, []);
  return (
    <>
      <Navbar />
      
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden" style={{ background: '#12314F' }}>
        <Image
          src="/images/Commonspace.webp"
          alt="WanderXP Adventures"
          fill
          className="object-cover opacity-30 mix-blend-luminosity"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#12314F] via-[#12314F]/60 to-transparent" />
        <div className="relative z-10 h-full max-w-[1400px] mx-auto px-6 md:px-10 flex flex-col justify-end pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 mb-4"
          >
            <Compass size={18} className="text-waabi-green" />
            <span className="label-upper text-waabi-green">WanderXP</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl font-serif font-medium text-white mb-6 max-w-3xl"
          >
            Real Kolkata, <span className="text-waabi-green italic">no filter.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-white/60 text-lg max-w-xl"
          >
            Street food crawls, heritage walks, rooftop nights — priced for backpackers, led by people who actually live here. This is WanderXP.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 flex items-center gap-3"
          >
            <div className="text-xs font-bold uppercase tracking-widest text-white/50">In Partnership With</div>
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/20">
              <span className="font-serif text-white font-medium">Local WanderXP Partners</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Experiences Grid */}
      <section className="py-24 md:py-32 bg-waabi-bg min-h-[500px]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          {loading ? (
             <div className="flex justify-center items-center h-64">
               <div className="w-10 h-10 border-4 border-waabi-green border-t-dark rounded-full animate-spin"></div>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {experiences.map((exp, i) => (
                <motion.div
                  key={exp._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="waabi-card group bg-white"
                >
                  <div className="relative h-[280px] overflow-hidden bg-gray-100">
                    {exp.image && (
                      <Image
                        src={urlFor(exp.image).width(600).url()}
                        alt={exp.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-dark/50 to-transparent" />
                    <span className="absolute top-4 left-4 px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider rounded-full border border-white/30">
                      {exp.category}
                    </span>
                    <div className="absolute bottom-4 left-4 right-4 flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-white/80 text-sm">
                        <Clock size={14} />
                        {exp.duration}
                      </div>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col h-full">
                    <h3 className="font-serif text-xl text-dark mb-2">{exp.title}</h3>
                    <p className="text-dark/60 text-sm leading-relaxed mb-6 flex-1">{exp.description}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-2xl font-serif font-bold text-dark">
                        {exp.price === 0 ? "Free" : `₹${exp.price}`}
                      </span>
                      <Link
                        href={`https://wa.me/919875432441?text=Hi!%20I'm%20interested%20in%20the%20${encodeURIComponent(exp.title)}%20experience.`}
                        target="_blank"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-waabi-green text-dark text-sm font-semibold rounded-full hover:bg-waabi-green-dark transition-all duration-300"
                      >
                        Book <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {experiences.length === 0 && (
                <div className="col-span-full text-center py-12 text-dark/50 font-medium">
                  No experiences available at the moment.
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 bg-[#12314F] text-white">
        <div className="max-w-[1000px] mx-auto px-6 md:px-10 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="heading-lg font-serif mb-6"
          >
            Ready to go <span className="text-waabi-green italic">explore?</span>
          </motion.h2>
          <p className="text-white/60 text-lg mb-10 max-w-lg mx-auto">
            Message us on WhatsApp to book an experience or ask us to build a custom one — no travel agency fees, just a straight answer.
          </p>
          <Link
            href="https://wa.me/919875432441?text=Hi%20Calcutta%20Backpackers!%20I'd%20like%20to%20know%20more%20about%20WanderXP%20tours."
            target="_blank"
            className="inline-flex items-center gap-2 px-8 py-4 bg-waabi-green text-dark font-semibold rounded-full hover:bg-waabi-green-dark hover:scale-105 transition-all duration-300 shadow-[0_8px_30px_rgba(201,222,240,0.3)]"
          >
            Book on WhatsApp <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
