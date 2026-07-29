import { Metadata } from "next";
import { getPageSeo } from "@/lib/sanity";
import WanderXPClient from "./WanderXPClient";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("WanderXP").catch(() => null);
  return {
    title: seo?.metaTitle || "WanderXP | Kolkata Street Food Tours, Heritage Walks & Local Experiences",
    description: seo?.metaDescription || "Real Kolkata, not the guidebook version. WanderXP experiences from Calcutta Backpackers: street food crawls, heritage walks, sunrise boat rides, and Kumartuli art tours — priced for backpackers, led by locals.",
  };
}

export default function WanderXPPage() {
  return <WanderXPClient />;
}
