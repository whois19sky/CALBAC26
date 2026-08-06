import { Metadata } from "next";
import { getPageSeo, getRooms } from "@/lib/sanity";
import TheNestClient from "./TheNestClient";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("The Nest XP").catch(() => null);
  return {
    title: seo?.metaTitle || "The Nest XP | Calcutta Backpackers' Growing Network Across Asia",
    description: seo?.metaDescription || "The Nest XP is Calcutta Backpackers' home base and the start of a growing network of independent hospitality venues across Asia. AC dorms from ₹499, private ensuite rooms from ₹1,999 — book direct in Kolkata today.",
  };
}

export default async function TheNestPage() {
  const rooms = await getRooms().catch(() => []);
  return <TheNestClient initialRooms={rooms} />;
}
