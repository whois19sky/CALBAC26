import { Suspense } from "react";
import { Metadata } from "next";
import { getPageSeo } from "@/lib/sanity";
import CheckinForm from "./CheckinForm";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("Check-in").catch(() => null);
  return {
    title: seo?.metaTitle || "Web Check-in | Calcutta Backpackers Poshtel, Kolkata",
    description: seo?.metaDescription || "Skip the front-desk wait — complete your check-in online before you arrive at Calcutta Backpackers.",
  };
}

export default function CheckinPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-waabi-green border-t-dark rounded-full animate-spin"></div></div>}>
      <CheckinForm />
    </Suspense>
  );
}
