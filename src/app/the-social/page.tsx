import { Metadata } from "next";
import TheSocialClient from "./TheSocialClient";

export const metadata: Metadata = {
  title: "The Social | Community, Events & Rooftop Nights in Kolkata",
  description: "Rooftop music nights, daily chai sessions, and travelers from 50+ countries — the community side of Kolkata's best value poshtel, Calcutta Backpackers.",
};

export default function TheSocialPage() {
  return <TheSocialClient />;
}
