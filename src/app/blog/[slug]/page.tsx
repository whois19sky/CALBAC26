import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogPostBySlug, urlFor } from "@/lib/sanity";
import BlogPostClient from "./BlogPostClient";

type Props = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 300;

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

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  // Same cache()-wrapped call generateMetadata() already made above - React
  // dedupes it automatically, so this doesn't trigger a second Sanity fetch.
  const post = await getBlogPostBySlug(slug).catch(() => null);

  if (!post) notFound();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage ? urlFor(post.coverImage).width(1200).height(630).url() : undefined,
    datePublished: post.publishedAt,
    author: { "@type": "Person", name: post.author },
    publisher: {
      "@type": "Organization",
      name: "Calcutta Backpackers Hostel, Kolkata",
      url: "https://www.calcuttabackpackers.com",
    },
    mainEntityOfPage: `https://www.calcuttabackpackers.com/blog/${slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <BlogPostClient post={post} />
    </>
  );
}
