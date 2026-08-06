import { Suspense } from "react";
import { Metadata } from "next";
import { getPageSeo, getRooms } from "@/lib/sanity";
import BookingForm from "./BookingForm";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("Booking").catch(() => null);
  return {
    title: seo?.metaTitle || "Book Your Stay | Calcutta Backpackers Hostel, Kolkata",
    description: seo?.metaDescription || "Book dorms from ₹499 or private rooms from ₹1,999 direct with Calcutta Backpackers — best rate guaranteed, no OTA markup, confirmed over WhatsApp.",
  };
}

export default async function BookingPage() {
  const rooms = await getRooms().catch(() => []);
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-waabi-green border-t-dark rounded-full animate-spin"></div></div>}>
      <BookingForm initialRooms={rooms} />
    </Suspense>
  );
}
