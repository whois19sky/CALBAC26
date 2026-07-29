import { Metadata } from "next";
import { getPageSeo } from "@/lib/sanity";
import TheSocialClient from "./TheSocialClient";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("The Social").catch(() => null);
  return {
    title: seo?.metaTitle || "The Social | Community, Events & Rooftop Nights in Kolkata",
    description: seo?.metaDescription || "Rooftop music nights, daily chai sessions, and travelers from 50+ countries — the community side of Kolkata's best value poshtel, Calcutta Backpackers.",
  };
}

export default function TheSocialPage() {
  return <TheSocialClient />;
}
