import { Metadata } from "next";
import BlogClient from "./BlogClient";

export const metadata: Metadata = {
  title: "Kolkata Travel Blog | Budget Tips & Guides | Calcutta Backpackers",
  description: "Real Kolkata travel guides from Calcutta Backpackers — budget tips, street food spots, heritage walks, and honest advice for backpackers and solo travelers on a budget.",
};

export default function BlogPage() {
  return <BlogClient />;
}
