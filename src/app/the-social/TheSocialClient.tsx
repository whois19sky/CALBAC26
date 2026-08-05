"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { useSiteSettings } from "@/lib/sanity";
import InstagramEmbed from "@/components/InstagramEmbed";

const socialPosts = [
  { image: "/images/Community.webp", caption: "Community vibes at its best" },
  { image: "/images/Community.webp", caption: "Travelers from 50+ countries" },
  { image: "/images/Commonspace.webp", caption: "Our sunlit common space" },
  { image: "/images/Community1.webp", caption: "Evening chai sessions" },
  { image: "/images/Dorm1.webp", caption: "₹499 dorms that don't feel like ₹499" },
  { image: "/images/corridor1.webp", caption: "Good design, honest prices" },
];

export default function TheSocialPage() {
  const { settings } = useSiteSettings();
  const instagramPosts = settings?.instagramPosts || [];

  return (
    <>
      
      
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[450px] overflow-hidden bg-dark">
        <Image
          src="/images/Community1.webp"
          alt="The Social - Community Feed"
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent" />
        <div className="relative z-10 h-full max-w-[1400px] mx-auto px-6 md:px-10 flex flex-col justify-end pb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="label-upper text-waabi-green block mb-4"
          >
            The Social
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl font-serif font-medium text-white mb-4 max-w-3xl"
          >
            You didn&apos;t come this far to <span className="text-waabi-green italic">stop.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-white/60 text-lg max-w-xl"
          >
            Stay connected with the latest hostel news, community events, and stories from fellow travelers.
          </motion.p>
        </div>
      </section>

      {/* Instagram-style Grid */}
      <section className="py-24 md:py-32 bg-waabi-bg">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="heading-lg font-serif text-dark mb-4 text-center"
          >
            Stories @ <span className="text-waabi-green-dark italic">Calcutta Backpackers</span>
          </motion.h2>
          <p className="text-dark/50 text-center mb-16 text-lg">A glimpse into our world through moments captured by our community.</p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {socialPosts.map((post, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.6 }}
                className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer"
              >
                <Image
                  src={post.image}
                  alt={post.caption}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/50 transition-all duration-500 flex items-center justify-center">
                  <p className="text-white font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-4 text-center">
                    {post.caption}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {instagramPosts.length > 0 && (
            <div className="mt-20">
              <p className="text-center text-sm font-bold text-dark/40 uppercase tracking-widest mb-8">
                Straight From Our Instagram
              </p>
              <InstagramEmbed postUrls={instagramPosts} />
            </div>
          )}
        </div>
      </section>

      {/* Blog Teaser */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="heading-lg font-serif text-dark mb-6"
          >
            From the <span className="text-waabi-green-dark italic">blog.</span>
          </motion.h2>
          <p className="text-dark/50 mb-10 text-lg max-w-lg mx-auto">
            Travel tips, stories, and guides from the Calcutta Backpackers community.
          </p>
          <Link href="/blog" className="btn-primary">
            Read the Blog <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Community CTA */}
      <section className="py-16 bg-waabi-green">
        <div className="max-w-[1000px] mx-auto px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="font-serif text-2xl text-dark mb-2">Join the conversation</h3>
            <p className="text-dark/60">Follow us on Instagram for daily updates and stories.</p>
          </div>
          <a
            href="https://www.instagram.com/calcuttabackpackers/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-dark text-white font-semibold rounded-full hover:scale-105 transition-all duration-300"
          >
            <MessageCircle size={18} /> Follow @calcuttabackpackers
          </a>
        </div>
      </section>

      
    </>
  );
}
