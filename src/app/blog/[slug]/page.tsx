import { Metadata } from "next";
import { getBlogPostBySlug, urlFor } from "@/lib/sanity";
import BlogPostClient from "./BlogPostClient";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const post = await getBlogPostBySlug(slug);

    if (!post) {
      return {
        title: "Blog | Calcutta Backpackers",
        description: "Kolkata travel guides and stories from Calcutta Backpackers.",
      };
    }

    const title = `${post.title} | Calcutta Backpackers Blog`;
    const description = post.excerpt || "Kolkata travel guides and stories from Calcutta Backpackers.";
    const imageUrl = post.coverImage ? urlFor(post.coverImage).width(1200).height(630).url() : undefined;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "article",
        images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630 }] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: imageUrl ? [imageUrl] : undefined,
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
