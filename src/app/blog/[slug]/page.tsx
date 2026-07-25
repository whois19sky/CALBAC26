import { Metadata } from "next";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import BlogPostClient from "./BlogPostClient";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const supabase = await createServerSupabaseClient();
    const { data: post } = await supabase
      .from("blog_posts")
      .select("title, excerpt, cover_image, category, published_at")
      .eq("slug", slug)
      .single();

    if (!post) {
      return {
        title: "Blog | Calcutta Backpackers",
        description: "Kolkata travel guides and stories from Calcutta Backpackers.",
      };
    }

    const title = `${post.title} | Calcutta Backpackers Blog`;
    const description = post.excerpt || "Kolkata travel guides and stories from Calcutta Backpackers.";

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "article",
        images: post.cover_image ? [{ url: post.cover_image, width: 1200, height: 630 }] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: post.cover_image ? [post.cover_image] : undefined,
      },
    };
  } catch {
    return {
      title: "Blog | Calcutta Backpackers",
      description: "Kolkata travel guides and stories from Calcutta Backpackers.",
    };
  }
}

export default function BlogPostPage() {
  return <BlogPostClient />;
}
