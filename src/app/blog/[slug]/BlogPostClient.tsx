"use client";

import { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";
import ReactMarkdown from "react-markdown";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/client";
import type { BlogPost } from "@/lib/types";
import { format } from "date-fns";

export default function BlogPostClient() {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchPost() {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error || !data) {
        notFound();
      } else {
        setPost(data);
      }
      setLoading(false);
    }
    fetchPost();
  }, [slug, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-waabi-green border-t-waabi-green-dark rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!post) return null;

  return (
    <>
      <Navbar />
      
      <article className="pt-32 pb-24 md:pt-40 md:pb-32 bg-white min-h-screen">
        <div className="max-w-[800px] mx-auto px-6 md:px-10">
          
          <Link href="/blog" className="inline-flex items-center gap-2 text-dark/50 hover:text-waabi-green-dark transition-colors mb-10 text-sm font-medium uppercase tracking-wider">
            <ArrowLeft size={16} /> Back to Blog
          </Link>

          <div className="flex items-center gap-4 text-xs text-dark/50 font-medium uppercase tracking-wider mb-6">
            <span className="flex items-center gap-1.5 text-waabi-green-dark"><Tag size={14} /> {post.category}</span>
            <span className="flex items-center gap-1.5"><Calendar size={14} /> {format(new Date(post.published_at || post.created_at), 'MMM dd, yyyy')}</span>
          </div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium text-dark mb-10 leading-[1.1]"
          >
            {post.title}
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-4 mb-12"
          >
            <div className="w-12 h-12 rounded-full bg-waabi-green/20 flex items-center justify-center">
              <User size={20} className="text-waabi-green-dark" />
            </div>
            <div>
              <p className="text-sm font-bold text-dark">{post.author}</p>
              <p className="text-xs text-dark/50">Author</p>
            </div>
          </motion.div>

          {post.cover_image && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="relative w-full aspect-video rounded-3xl overflow-hidden mb-16"
            >
              <Image
                src={post.cover_image}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="prose prose-lg prose-headings:font-serif prose-headings:font-medium prose-a:text-waabi-green-dark prose-img:rounded-2xl max-w-none text-dark/80"
          >
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </motion.div>
          
        </div>
      </article>

      <Footer />
    </>
  );
}
