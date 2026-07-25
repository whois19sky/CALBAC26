import { Metadata } from "next";
import TheNestClient from "./TheNestClient";

export const metadata: Metadata = {
  title: "The Nest XP | Calcutta Backpackers' Growing Network Across Asia",
  description: "The Nest XP is Calcutta Backpackers' home base and the start of a growing network of independent hospitality venues across Asia. AC dorms from ₹499, private ensuite rooms from ₹1,999 — book direct in Kolkata today.",
};

export default function TheNestPage() {
  return <TheNestClient />;
}
