"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Star, Users, Award, Wifi, Wind, Lock, Tv, UtensilsCrossed, WashingMachine } from "lucide-react";
import { urlFor } from "@/lib/sanity";
import type { SanityRoom } from "@/lib/sanity/queries";

export default function TheNestPage({ initialRooms }: { initialRooms: SanityRoom[] }) {
  const rooms = initialRooms;

  const lowestPrice = rooms.length > 0
    ? Math.min(...rooms.map((r) => r.pricePerNight))
    : null;

  const stats = [
    { value: "15,000+", label: "Happy Guests", icon: Users },
    { value: "4.9/5", label: "Google Rating", icon: Star },
    { value: lowestPrice !== null ? `₹${lowestPrice}` : "—", label: "Dorms Start From", icon: Award },
  ];

  return (
    <>
      
      
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px] bg-dark overflow-hidden">
        <Image
          src="/images/Community.webp"
          alt="The Nest - Calcutta Backpackers"
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent" />
        <div className="relative z-10 h-full max-w-[1400px] mx-auto px-6 md:px-10 flex flex-col justify-end pb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="label-upper text-waabi-green block mb-4"
          >
            The Nest XP
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl font-serif font-medium text-white mb-6 max-w-3xl"
          >
            Home base. And the start of <span className="text-waabi-green italic">something bigger.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-white/70 text-lg max-w-xl"
          >
            Dorm beds, private rooms, or full apartments in Kolkata — all priced fair, all genuinely comfortable. The first stop in a growing network across Asia.
          </motion.p>
        </div>
      </section>

      {/* Network Concept Intro */}
      <section className="py-20 md:py-28 bg-dark text-white">
        <div className="max-w-4xl mx-auto px-6 md:px-10 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-block px-4 py-1.5 bg-white/10 text-white/70 text-xs font-bold uppercase tracking-widest rounded-full mb-6"
          >
            Coming Soon
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl md:text-5xl font-serif font-medium mb-6"
          >
            One city today. <span className="text-waabi-green italic">More across Asia, soon.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-white/60 text-lg leading-relaxed max-w-2xl mx-auto"
          >
            The Nest XP is where Calcutta Backpackers lives today — and the first stop in a
            growing network of independent hospitality venues across Asia. Not a franchise,
            not a chain: every partner keeps its own identity, its own character, its own
            neighborhood to explore. Same promise everywhere — real value, real community.
          </motion.p>
        </div>
      </section>

      {/* Kolkata */}
      <section className="bg-waabi-green py-8 md:py-12">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-24">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="flex items-center gap-4 text-center md:text-left"
            >
              <stat.icon size={28} className="text-dark/60" />
              <div>
                <div className="text-3xl font-serif font-bold text-dark">{stat.value}</div>
                <p className="text-dark/60 text-sm font-medium">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Rooms */}
      <section className="py-24 md:py-32 bg-waabi-bg">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="label-upper text-waabi-green-dark block text-center mb-4"
          >
            Kolkata, India — Open Now
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="heading-xl font-serif text-dark mb-16 md:mb-20 text-center"
          >
            Choose your <span className="text-waabi-green-dark italic">stay.</span>
          </motion.h2>

          <div className="space-y-12">
            {rooms.length === 0 ? (
              <p className="text-center text-dark/50 py-20">Room information is being updated — check back shortly, or message us on WhatsApp.</p>
            ) : (
            rooms.map((room, i) => (
              <motion.div
                key={room._id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className="waabi-card bg-white p-4 md:p-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className={`relative h-[300px] md:h-[450px] rounded-2xl overflow-hidden ${i % 2 === 1 ? 'md:order-2' : ''}`}>
                    <Image
                      src={room.images?.[0] ? urlFor(room.images[0]).width(900).url() : "/images/Community.webp"}
                      alt={room.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4 px-3 py-1.5 bg-dark/70 backdrop-blur-md text-white text-xs font-bold rounded-full">
                      {room.capacity} {room.capacity === 1 ? "Guest" : "Guests"}
                    </div>
                  </div>

                  <div className={`flex flex-col justify-center py-4 md:py-8 ${i % 2 === 1 ? 'md:order-1 md:pr-8' : 'md:pl-4'}`}>
                    <span className="inline-block px-4 py-1.5 bg-waabi-green/30 text-waabi-green-dark text-xs font-bold uppercase tracking-widest rounded-full w-fit mb-6">
                      {room.tagline}
                    </span>
                    <h3 className="heading-lg font-serif mb-4 text-dark">{room.name}</h3>
                    <p className="text-dark/70 leading-relaxed text-lg mb-8">{room.description}</p>

                    <div className="grid grid-cols-2 gap-3 mb-10">
                      {(room.features || []).map((f) => (
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
                        <span className="text-3xl font-serif font-bold text-dark">₹{room.pricePerNight.toLocaleString("en-IN")}<span className="text-base font-sans font-normal text-dark/50">/night</span></span>
                      </div>
                      <Link
                        href={`/booking?room=${room._id}`}
                        className="btn-primary sm:ml-auto w-full sm:w-auto shadow-lg"
                      >
                        Book This Room <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
            )}
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="heading-lg font-serif text-dark mb-12 text-center"
          >
            Our <span className="text-waabi-green-dark italic">Spots</span>
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-panel p-8 bg-waabi-bg/50"
            >
              <h3 className="font-serif text-2xl text-dark mb-2">Main — Calcutta Backpackers</h3>
              <p className="text-dark/60 leading-relaxed">6/27a, Pashupati Bhattacharya Road, Kolkata 700034</p>
              <p className="text-dark/50 text-sm mt-4">Near Sudder Street • Park Street Metro • 10 min from New Market</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="glass-panel p-8 bg-waabi-bg/50"
            >
              <h3 className="font-serif text-2xl text-dark mb-2">The Studio</h3>
              <p className="text-dark/60 leading-relaxed">Location details coming soon</p>
              <p className="text-dark/50 text-sm mt-4">Our newest space for extended stays and creative retreats</p>
            </motion.div>
          </div>
        </div>
      </section>

      
    </>
  );
}
