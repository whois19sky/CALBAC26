"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, User } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getBlogPosts, urlFor } from "@/lib/sanity";
import type { SanityBlogPost } from "@/lib/sanity/queries";
import { format } from "date-fns";

export default function BlogClient() {
  const [posts, setPosts] = useState<SanityBlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const data = await getBlogPosts();
        if (data) setPosts(data);
      } catch (err) {
        console.error("Failed to fetch blog posts from Sanity:", err);
      }
      setLoading(false);
    }
    fetchPosts();
  }, []);

  return (
    <>
      <Navbar />
      
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-waabi-bg relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl font-serif font-medium text-dark mb-6"
          >
            The Backpackers <span className="text-waabi-green-dark italic">Blog.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-dark/60 text-lg max-w-xl mx-auto"
          >
            Kolkata travel guides, budget tips, and real stories — written for backpackers who'd rather spend on experiences than on a hotel room.
          </motion.p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-16 md:py-24 bg-white min-h-[50vh]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="w-8 h-8 border-4 border-waabi-green border-t-waabi-green-dark rounded-full animate-spin"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20 text-dark/50">
              <p className="text-xl">No posts published yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {posts.map((post, i) => (
                <motion.article
                  key={post._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="flex flex-col group"
                >
                  <Link href={`/blog/${post.slug.current}`} className="block relative h-[250px] w-full rounded-2xl overflow-hidden mb-6">
                    {post.coverImage ? (
                      <Image
                        src={urlFor(post.coverImage).width(600).url()}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-waabi-green/20 flex items-center justify-center">
                        <span className="text-waabi-green-dark font-serif text-4xl">CB</span>
                      </div>
                    )}
                    <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-md text-dark text-xs font-bold uppercase tracking-wider rounded-full">
                      {post.category}
                    </div>
                  </Link>

                  <div className="flex flex-col flex-grow">
                    <div className="flex items-center gap-4 text-xs text-dark/50 font-medium uppercase tracking-wider mb-3">
                      <span className="flex items-center gap-1.5"><Calendar size={14} /> {format(new Date(post.publishedAt), 'MMM dd, yyyy')}</span>
                      <span className="flex items-center gap-1.5"><User size={14} /> {post.author}</span>
                    </div>
                    
                    <h2 className="font-serif text-2xl text-dark mb-3 line-clamp-2 group-hover:text-waabi-green-dark transition-colors">
                      <Link href={`/blog/${post.slug.current}`}>{post.title}</Link>
                    </h2>
                    
                    <p className="text-dark/60 leading-relaxed mb-6 line-clamp-3">
                      {post.excerpt}
                    </p>

                    <Link 
                      href={`/blog/${post.slug.current}`}
                      className="mt-auto inline-flex items-center gap-2 text-waabi-green-dark font-semibold text-sm hover:gap-3 transition-all uppercase tracking-wider"
                    >
                      Read Story <ArrowRight size={16} />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
