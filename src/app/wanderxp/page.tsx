import { Metadata } from "next";
import WanderXPClient from "./WanderXPClient";

export const metadata: Metadata = {
  title: "WanderXP | Kolkata Street Food Tours, Heritage Walks & Local Experiences",
  description: "Real Kolkata, not the guidebook version. WanderXP experiences from Calcutta Backpackers: street food crawls, heritage walks, sunrise boat rides, and Kumartuli art tours — priced for backpackers, led by locals.",
};

export default function WanderXPPage() {
  return <WanderXPClient />;
}
