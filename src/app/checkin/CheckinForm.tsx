"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/client";
import { uploadFileToStorage } from "@/lib/supabase/client";
import { CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

export default function CheckinPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const supabase = createClient();
  
  const [formData, setFormData] = useState({
    booking_id: "",
    full_name: "",
    email: "",
    phone: "",
    nationality: "",
    id_type: "Passport",
    id_number: "",
    id_image_url: "",
    emergency_contact: "",
    special_requests: ""
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const toastId = toast.loading("Uploading image...");
    const url = await uploadFileToStorage(file, 'uploads');
    
    if (url) {
      setFormData({ ...formData, id_image_url: url });
      toast.success("Image uploaded successfully!", { id: toastId });
    } else {
      toast.error("Failed to upload image. Did you create the 'uploads' bucket?", { id: toastId });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Submitting check-in details...");

    try {
      // Find booking if ID is provided
      let actualBookingId = null;
      if (formData.booking_id) {
        const { data: booking } = await supabase
          .from('bookings')
          .select('id')
          .ilike('id', `${formData.booking_id}%`)
          .single();
          
        if (booking) {
          actualBookingId = booking.id;
        }
      }

      // Save to Supabase
      const { error } = await supabase.from('checkins').insert({
        booking_id: actualBookingId,
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        nationality: formData.nationality,
        id_type: formData.id_type,
        id_number: formData.id_number,
        id_image_base64: formData.id_image_url, // Storing URL in the text column
        emergency_contact: formData.emergency_contact,
        special_requests: formData.special_requests
      });

      if (error) throw error;

      // Mirror to Google Sheets + Drive for the front desk's records.
      // Non-blocking — a sync failure never stops the guest's check-in from succeeding.
      fetch("/api/google/sync-checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          booking_id: actualBookingId || formData.booking_id || "N/A",
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone,
          nationality: formData.nationality,
          id_type: formData.id_type,
          id_number: formData.id_number,
          emergency_contact: formData.emergency_contact,
          special_requests: formData.special_requests,
          id_image_url: formData.id_image_url,
        }),
      }).catch((err) => console.error("Google sync failed:", err));

      toast.success("Check-in successful!", { id: toastId });
      setSuccess(true);
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit check-in. Please try again.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-waabi-bg border border-dark/10 rounded-xl px-4 py-3 text-base text-dark focus:outline-none focus:border-waabi-green-dark transition-colors";
  const labelClass = "block text-xs font-bold text-dark/70 uppercase tracking-wider mb-2";

  return (
    <>
      <Navbar />
      
      <main className="pt-32 pb-24 md:pt-40 md:pb-32 bg-waabi-bg min-h-screen">
        <div className="max-w-[700px] mx-auto px-6">
          <div className="mb-12 text-center">
            <h1 className="heading-lg font-serif text-dark mb-4">Web <span className="text-waabi-green-dark italic">Check-in.</span></h1>
            <p className="text-dark/60 text-lg">Save time at the front desk by filling out your details before arrival.</p>
          </div>

          <div className="waabi-card bg-white p-6 md:p-10 shadow-xl">
            {success ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
                <div className="w-20 h-20 bg-waabi-green/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={40} className="text-waabi-green-dark" />
                </div>
                <h2 className="text-3xl font-serif text-dark mb-4">You&apos;re all set!</h2>
                <p className="text-dark/70 mb-8 max-w-md mx-auto">
                  Your check-in details have been received securely. Please present your physical ID at the front desk upon arrival.
                </p>
                <button onClick={() => window.location.href = '/'} className="btn-primary shadow-lg">
                  Return to Home
                </button>
              </motion.div>
            ) : (
              <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="space-y-6">
                
                {/* Booking Info */}
                <div className="pb-6 border-b border-dark/10">
                  <label className={labelClass}>Booking Reference ID (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 8f4a2b9"
                    value={formData.booking_id}
                    onChange={(e) => setFormData({...formData, booking_id: e.target.value})}
                    className={inputClass}
                  />
                  <p className="text-xs text-dark/40 mt-2">Found in your WhatsApp confirmation message.</p>
                </div>

                {/* Personal Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="md:col-span-2">
                    <label className={labelClass}>Full Name as per ID *</label>
                    <input 
                      required type="text"
                      value={formData.full_name}
                      onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Email Address *</label>
                    <input 
                      required type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Phone Number *</label>
                    <input 
                      required type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Nationality *</label>
                    <input 
                      required type="text"
                      value={formData.nationality}
                      onChange={(e) => setFormData({...formData, nationality: e.target.value})}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Emergency Contact (Name & Phone) *</label>
                    <input 
                      required type="text"
                      value={formData.emergency_contact}
                      onChange={(e) => setFormData({...formData, emergency_contact: e.target.value})}
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* ID Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-dark/10">
                  <div>
                    <label className={labelClass}>ID Document Type *</label>
                    <select 
                      required
                      value={formData.id_type}
                      onChange={(e) => setFormData({...formData, id_type: e.target.value})}
                      className={inputClass}
                    >
                      <option value="Passport">Passport</option>
                      <option value="Aadhaar">Aadhaar Card</option>
                      <option value="Driver License">Driver's License</option>
                      <option value="Voter ID">Voter ID</option>
                      <option value="Other Govt ID">Other Govt. Issued ID</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>ID Document Number *</label>
                    <input 
                      required type="text"
                      value={formData.id_number}
                      onChange={(e) => setFormData({...formData, id_number: e.target.value})}
                      className={inputClass}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>Upload Verified ID Photo *</label>
                    <input 
                      required type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full bg-waabi-bg border border-dark/10 rounded-xl px-4 py-2.5 text-dark focus:outline-none focus:border-waabi-green-dark transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-waabi-green/20 file:text-waabi-green-dark hover:file:bg-waabi-green/30"
                    />
                    {formData.id_image_url && <p className="text-xs text-green-600 mt-2 font-bold">✓ Image uploaded successfully</p>}
                    <p className="text-xs text-dark/40 mt-2">Please upload a clear photo of your selected ID document.</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>Special Requests</label>
                    <textarea 
                      rows={3}
                      value={formData.special_requests}
                      onChange={(e) => setFormData({...formData, special_requests: e.target.value})}
                      className={`${inputClass} resize-none`}
                    />
                  </div>
                </div>

                <div className="pt-6">
                  <button type="submit" disabled={loading} className="btn-primary w-full shadow-lg justify-center flex items-center gap-2">
                    {loading ? (
                      <span className="w-5 h-5 border-2 border-dark/20 border-t-dark rounded-full animate-spin block"></span>
                    ) : (
                      "Submit Check-in Details"
                    )}
                  </button>
                  <p className="text-[11px] text-center text-dark/40 mt-4 leading-relaxed">
                    By submitting this form, you agree to our house rules and verify that all information provided is accurate and matches your physical ID document.
                  </p>
                </div>
              </motion.form>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
