import { Metadata } from "next";
import { getPageSeo } from "@/lib/sanity";
import BlogClient from "./BlogClient";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("Blog").catch(() => null);
  return {
    title: seo?.metaTitle || "Kolkata Travel Blog | Budget Tips & Guides | Calcutta Backpackers",
    description: seo?.metaDescription || "Real Kolkata travel guides from Calcutta Backpackers — budget tips, street food spots, heritage walks, and honest advice for backpackers and solo travelers on a budget.",
  };
}

export default function BlogPage() {
  return <BlogClient />;
}
