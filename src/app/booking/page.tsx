import { Suspense } from "react";
import { Metadata } from "next";
import BookingForm from "./BookingForm";

export const metadata: Metadata = {
  title: "Book Your Stay | Calcutta Backpackers Poshtel, Kolkata",
  description: "Book dorms from ₹499 or private rooms from ₹1,999 direct with Calcutta Backpackers — best rate guaranteed, no OTA markup, confirmed over WhatsApp.",
};

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-waabi-green border-t-dark rounded-full animate-spin"></div></div>}>
      <BookingForm />
    </Suspense>
  );
}
