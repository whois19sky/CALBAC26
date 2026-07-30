"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { format } from "date-fns";
import type { Booking } from "@/lib/types";
import { Search, Filter, MoreVertical, MessageCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function BookingsManager() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const supabase = createClient();

  const fetchBookings = async () => {
    setLoading(true);
    let query = supabase.from('bookings').select('*, room:rooms(*)').order('created_at', { ascending: false });
    
    if (search) {
      query = query.or(`guest_name.ilike.%${search}%,id.ilike.%${search}%`);
    }

    const { data, error } = await query;
    if (data) setBookings(data as any[]);
    if (error) toast.error("Failed to fetch bookings");
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, [search]);

  const updateStatus = async (id: string, status: string) => {
    const toastId = toast.loading("Updating status...");
    const { error } = await supabase.from('bookings').update({ status }).eq('id', id);
    if (error) {
      toast.error("Failed to update status", { id: toastId });
    } else {
      toast.success("Status updated", { id: toastId });
      setBookings(bookings.map(b => b.id === id ? { ...b, status: status as any } : b));
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif text-dark font-medium">Bookings</h1>
          <p className="text-dark/60 mt-1">Manage all reservation requests</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-dark/5 overflow-hidden flex flex-col min-h-[600px]">
        {/* Toolbar */}
        <div className="p-4 border-b border-dark/5 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative w-full sm:w-96">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark/40" />
            <input 
              type="text" 
              placeholder="Search guest name or Ref ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-dark/10 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-waabi-green-dark transition-colors"
            />
          </div>
          <button className="btn-outline py-2.5 flex items-center gap-2 w-full sm:w-auto justify-center">
            <Filter size={16} /> Filters
          </button>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-x-auto">
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-waabi-green border-t-dark rounded-full animate-spin"></div>
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-dark/40 uppercase bg-gray-50/50 border-b border-dark/5">
                <tr>
                  <th className="px-6 py-4 font-bold">Guest & Ref</th>
                  <th className="px-6 py-4 font-bold">Contact</th>
                  <th className="px-6 py-4 font-bold">Room & Dates</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark/5">
                {bookings.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-dark/40">No bookings found.</td></tr>
                ) : (
                  bookings.map(booking => (
                    <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-dark text-base">{booking.guest_name}</p>
                        <p className="text-xs font-mono text-dark/50 mt-1 uppercase">Ref: {booking.id.split('-')[0]}</p>
                        <p className="text-[10px] text-dark/40 mt-1">Booked: {format(new Date(booking.created_at), 'MMM dd, HH:mm')}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-dark/80">{booking.guest_email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-dark/80 font-medium">{booking.guest_phone}</p>
                          <a href={`https://wa.me/${booking.guest_phone.replace(/\D/g, '')}`} target="_blank" className="text-green-600 hover:text-green-700">
                            <MessageCircle size={14} />
                          </a>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-dark bg-gray-100 px-2 py-1 rounded-md inline-block mb-2">{booking.room_name || booking.room?.name || 'Unknown'}</p>
                        <div className="flex items-center gap-2 text-dark/70 text-xs font-medium">
                          <span className="text-green-600">{format(new Date(booking.check_in), 'MMM dd')}</span>
                          <span>→</span>
                          <span className="text-red-500">{format(new Date(booking.check_out), 'MMM dd')}</span>
                        </div>
                        <p className="text-xs text-dark/50 mt-1">{booking.guests_count} Guest(s)</p>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={booking.status}
                          onChange={(e) => updateStatus(booking.id, e.target.value)}
                          className={`px-3 py-1.5 text-xs font-bold rounded-full uppercase tracking-wider border-none focus:ring-2 cursor-pointer ${
                            booking.status === 'confirmed' ? 'bg-green-100 text-green-700 ring-green-500/50' :
                            booking.status === 'pending' ? 'bg-amber-100 text-amber-700 ring-amber-500/50' :
                            booking.status === 'checked_in' ? 'bg-blue-100 text-blue-700 ring-blue-500/50' :
                            'bg-red-100 text-red-700 ring-red-500/50'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="checked_in">Checked In</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 hover:bg-dark/5 rounded-lg transition-colors text-dark/40 hover:text-dark">
                          <MoreVertical size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
