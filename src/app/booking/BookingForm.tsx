"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { getRooms, urlFor, hasValidImage } from "@/lib/sanity";
import type { SanityRoom } from "@/lib/sanity/queries";
import { ArrowRight, Check, CheckCircle2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import RoomBrowser from "./RoomBrowser";

const WHATSAPP_NUMBER = "919875432441";

export default function BookingPage() {
  const searchParams = useSearchParams();
  const preselectedRoomId = searchParams.get("room");
  
  const [step, setStep] = useState(1);
  const [rooms, setRooms] = useState<SanityRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  // Form State
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guestsCount, setGuestsCount] = useState(1);
  const [selectedRoom, setSelectedRoom] = useState<SanityRoom | null>(null);
  
  const [guestDetails, setGuestDetails] = useState({
    name: "",
    email: "",
    phone: "",
    notes: ""
  });

  const [bookingId, setBookingId] = useState("");

  // Minimal, generic emergency fallback - only used if Sanity itself is
  // completely unreachable. Not meant to look like real branded room
  // options, just enough to keep the booking form usable in a true outage.
  const EMERGENCY_FALLBACK_ROOMS: SanityRoom[] = [
    { _id: "fallback-room", name: "Room / Dorm Bed", slug: { current: "room" }, tagline: "Contact us for current options", description: "Our room list is temporarily unavailable - message us directly on WhatsApp and we'll confirm availability and pricing.", pricePerNight: 0, capacity: 1, features: [], images: [], isActive: true, sortOrder: 1 },
  ];

  useEffect(() => {
    async function fetchRooms() {
      try {
        const data = await getRooms();
        if (data && data.length > 0) {
          setRooms(data);
          if (preselectedRoomId) {
            const room = data.find(r => r._id === preselectedRoomId || r.slug?.current === preselectedRoomId);
            if (room) setSelectedRoom(room);
          }
        } else {
          setRooms(EMERGENCY_FALLBACK_ROOMS);
        }
      } catch (err) {
        console.error("Failed to fetch rooms from Sanity, using emergency fallback:", err);
        setRooms(EMERGENCY_FALLBACK_ROOMS);
      }
      setLoading(false);
    }
    fetchRooms();
  }, [preselectedRoomId]);

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];

  const handleNextStep = () => {
    if (step === 1 && (!checkInDate || !checkOutDate)) {
      toast.error("Please select check-in and check-out dates");
      return;
    }
    if (step === 2 && !selectedRoom) {
      toast.error("Please select a room");
      return;
    }
    setStep(prev => prev + 1);
  };

  const calculateTotal = () => {
    if (!checkInDate || !checkOutDate || !selectedRoom) return 0;
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const nights = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
    return selectedRoom.pricePerNight * nights * (selectedRoom.capacity > 1 && !selectedRoom.name.includes("Private") ? guestsCount : 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom) return;

    const toastId = toast.loading("Processing booking...");
    const newBookingId = uuidv4();
    setBookingId(newBookingId);

    // Try to save to Supabase for the admin panel's records. This is a nice-to-have —
    // if it fails for any reason (Supabase down, misconfigured, etc.), the guest's
    // booking request must still go through to WhatsApp. We never block the core
    // conversion action on a database write succeeding.
    try {
      const { error } = await supabase.from('bookings').insert({
        id: newBookingId,
        guest_name: guestDetails.name,
        guest_email: guestDetails.email,
        guest_phone: guestDetails.phone,
        // room_id used to link to Supabase's rooms table, but real room content
        // now lives in Sanity (different ID format entirely) - that table is
        // effectively deprecated. Always null here to avoid a foreign-key error;
        // room_name (below) is now the reliable source of which room was booked.
        room_id: null,
        room_name: selectedRoom.name,
        check_in: checkInDate,
        check_out: checkOutDate,
        guests_count: guestsCount,
        notes: guestDetails.notes,
        status: 'pending',
        whatsapp_sent: false
      });
      if (error) throw error;

      // Mirror to Google Sheets too — also non-blocking.
      fetch("/api/google/sync-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: newBookingId,
          guest_name: guestDetails.name,
          guest_email: guestDetails.email,
          guest_phone: guestDetails.phone,
          room_name: selectedRoom.name,
          check_in: checkInDate,
          check_out: checkOutDate,
          guests_count: guestsCount,
          notes: guestDetails.notes,
          total_amount: calculateTotal(),
          status: "pending",
        }),
      }).catch((err) => console.error("Google Sheets sync failed:", err));
    } catch (error) {
      // Log it, but keep going — the guest still needs to reach WhatsApp.
      console.error("Booking record save failed (continuing to WhatsApp regardless):", error);
    }

    // Generate WhatsApp message and send the guest there — this always happens,
    // regardless of whether the database write above succeeded.
    const total = calculateTotal();
    const message = `*NEW BOOKING REQUEST*%0A%0A*Name:* ${guestDetails.name}%0A*Room:* ${selectedRoom.name}%0A*Check-in:* ${checkInDate}%0A*Check-out:* ${checkOutDate}%0A*Guests:* ${guestsCount}%0A*Est. Total:* ₹${total}%0A%0A*Ref ID:* ${newBookingId.split('-')[0]}`;

    toast.success("Booking request created!", { id: toastId });
    setStep(4);

    setTimeout(() => {
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
    }, 1500);
  };

  return (
    <>
      
      
      <main className="pt-32 pb-24 md:pt-40 md:pb-32 bg-waabi-bg min-h-screen">
        <div className="max-w-[800px] mx-auto px-6">
          
          <div className="mb-12">
            <h1 className="heading-lg font-serif text-dark mb-4 text-center">Complete your <span className="text-waabi-green-dark italic">booking.</span></h1>
            
            {/* Progress Bar */}
            <div className="flex items-center justify-center gap-2 mt-8">
              {[1, 2, 3].map((num) => (
                <div key={num} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    step >= num ? 'bg-waabi-green-dark text-white' : 'bg-dark/10 text-dark/40'
                  }`}>
                    {step > num ? <Check size={14} /> : num}
                  </div>
                  {num < 3 && (
                    <div className={`w-16 h-1 mx-2 rounded-full transition-colors ${
                      step > num ? 'bg-waabi-green-dark' : 'bg-dark/10'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="waabi-card bg-white p-6 md:p-10 shadow-xl">
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="text-2xl font-serif text-dark mb-6">Select Dates</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-sm font-bold text-dark/70 uppercase tracking-wider mb-2">Check-in Date</label>
                    <input 
                      type="date" 
                      min={today}
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      className="w-full bg-waabi-bg border border-dark/10 rounded-xl px-4 py-3 text-base text-dark focus:outline-none focus:border-waabi-green-dark transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-dark/70 uppercase tracking-wider mb-2">Check-out Date</label>
                    <input 
                      type="date" 
                      min={checkInDate || today}
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      className="w-full bg-waabi-bg border border-dark/10 rounded-xl px-4 py-3 text-base text-dark focus:outline-none focus:border-waabi-green-dark transition-colors"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-dark/70 uppercase tracking-wider mb-2">Number of Guests</label>
                    <select 
                      value={guestsCount}
                      onChange={(e) => setGuestsCount(Number(e.target.value))}
                      className="w-full bg-waabi-bg border border-dark/10 rounded-xl px-4 py-3 text-base text-dark focus:outline-none focus:border-waabi-green-dark transition-colors"
                    >
                      {[1,2,3,4,5,6,7,8].map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <button onClick={handleNextStep} className="btn-primary w-full shadow-lg flex items-center justify-center gap-2">
                  Continue to Rooms <ArrowRight size={18} />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-serif text-dark">Select a Room</h2>
                  <button onClick={() => setStep(1)} className="text-sm font-medium text-dark/50 hover:text-dark">Edit Dates</button>
                </div>

                {loading ? (
                  <div className="flex justify-center py-10"><div className="w-8 h-8 border-4 border-waabi-green border-t-waabi-green-dark rounded-full animate-spin"></div></div>
                ) : rooms.length === 0 ? (
                  <div className="text-center py-10 text-dark/50">
                    <p className="mb-2">Room information is being updated right now.</p>
                    <p>Message us on WhatsApp and we'll sort you out directly.</p>
                  </div>
                ) : (
                  <RoomBrowser
                    rooms={rooms}
                    selectedRoom={selectedRoom}
                    onSelectRoom={(room) => setSelectedRoom(room)}
                  />
                )}

                <div className="flex gap-4 mt-8">
                  <button onClick={() => setStep(1)} className="btn-outline w-1/3 text-center justify-center">Back</button>
                  <button onClick={handleNextStep} disabled={!selectedRoom} className="btn-primary w-2/3 shadow-lg justify-center text-center disabled:opacity-40 disabled:cursor-not-allowed">Continue to Details</button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-serif text-dark">Guest Details</h2>
                  <button onClick={() => setStep(2)} className="text-sm font-medium text-dark/50 hover:text-dark">Edit Room</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-dark/70 uppercase tracking-wider mb-2">Full Name *</label>
                      <input 
                        required
                        type="text" 
                        value={guestDetails.name}
                        onChange={(e) => setGuestDetails({...guestDetails, name: e.target.value})}
                        className="w-full bg-waabi-bg border border-dark/10 rounded-xl px-4 py-3 text-base text-dark focus:outline-none focus:border-waabi-green-dark transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-dark/70 uppercase tracking-wider mb-2">Email Address *</label>
                      <input 
                        required
                        type="email" 
                        value={guestDetails.email}
                        onChange={(e) => setGuestDetails({...guestDetails, email: e.target.value})}
                        className="w-full bg-waabi-bg border border-dark/10 rounded-xl px-4 py-3 text-base text-dark focus:outline-none focus:border-waabi-green-dark transition-colors"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-dark/70 uppercase tracking-wider mb-2">Phone / WhatsApp Number *</label>
                      <input 
                        required
                        type="tel" 
                        value={guestDetails.phone}
                        onChange={(e) => setGuestDetails({...guestDetails, phone: e.target.value})}
                        className="w-full bg-waabi-bg border border-dark/10 rounded-xl px-4 py-3 text-base text-dark focus:outline-none focus:border-waabi-green-dark transition-colors"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-dark/70 uppercase tracking-wider mb-2">Special Requests / Notes</label>
                      <textarea 
                        rows={3}
                        value={guestDetails.notes}
                        onChange={(e) => setGuestDetails({...guestDetails, notes: e.target.value})}
                        className="w-full bg-waabi-bg border border-dark/10 rounded-xl px-4 py-3 text-base text-dark focus:outline-none focus:border-waabi-green-dark transition-colors resize-none"
                      />
                    </div>
                  </div>

                  {/* Booking Summary */}
                  <div className="bg-waabi-bg p-6 rounded-2xl border border-dark/10">
                    <h4 className="font-serif font-medium text-lg mb-4 text-dark">Booking Summary</h4>
                    <div className="space-y-2 text-sm text-dark/70 mb-4">
                      <div className="flex justify-between"><span>Room:</span> <span className="font-medium text-dark">{selectedRoom?.name}</span></div>
                      <div className="flex justify-between"><span>Dates:</span> <span className="font-medium text-dark">{checkInDate} to {checkOutDate}</span></div>
                      <div className="flex justify-between"><span>Guests:</span> <span className="font-medium text-dark">{guestsCount}</span></div>
                    </div>
                    <div className="border-t border-dark/10 pt-4 flex justify-between items-center">
                      <span className="font-bold uppercase tracking-wider text-dark/50 text-xs">Estimated Total</span>
                      <span className="font-serif text-2xl font-bold text-dark">₹{calculateTotal()}</span>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button type="button" onClick={() => setStep(2)} className="btn-outline w-1/3 text-center justify-center">Back</button>
                    <button type="submit" className="btn-primary w-2/3 shadow-lg text-center justify-center">Request Booking</button>
                  </div>
                  <p className="text-xs text-center text-dark/40 mt-4">You will be redirected to WhatsApp to confirm your booking.</p>
                </form>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
                <div className="w-20 h-20 bg-waabi-green/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={40} className="text-waabi-green-dark" />
                </div>
                <h2 className="text-3xl font-serif text-dark mb-4">Request Sent!</h2>
                <p className="text-dark/70 mb-8 max-w-md mx-auto">
                  Your booking request (Ref: <strong>{bookingId.split('-')[0]}</strong>) has been generated. We are redirecting you to WhatsApp to finalize it.
                </p>
                <div className="space-y-4">
                  <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" className="btn-primary shadow-lg inline-block w-full max-w-xs">
                    Open WhatsApp Manually
                  </a>
                  <Link href="/" className="btn-outline inline-block w-full max-w-xs">
                    Return Home
                  </Link>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>
      
      
    </>
  );
}
