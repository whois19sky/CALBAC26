"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Users, BedDouble, CheckCircle2, TrendingUp, Calendar as CalendarIcon, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import type { Booking, CheckIn } from "@/lib/types";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBookings: 0,
    activeBookings: 0,
    checkinsToday: 0,
    occupancyRate: "…"
  });
  
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [recentCheckins, setRecentCheckins] = useState<CheckIn[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    async function fetchDashboardData() {
      // Fetch stats
      const today = new Date().toISOString().split('T')[0];
      
      const [
        { count: totalBookings },
        { count: activeBookings },
        { count: checkinsToday },
        { data: bookingsData },
        { data: checkinsData },
        { data: roomsData },
        { data: occupiedTodayData }
      ] = await Promise.all([
        supabase.from('bookings').select('*', { count: 'exact', head: true }),
        supabase.from('bookings').select('*', { count: 'exact', head: true }).in('status', ['confirmed', 'pending']),
        supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('check_in', today),
        supabase.from('bookings').select('*, room:rooms(*)').order('created_at', { ascending: false }).limit(5),
        supabase.from('checkins').select('*, booking:bookings(*)').order('created_at', { ascending: false }).limit(5),
        supabase.from('rooms').select('capacity').eq('is_active', true),
        // Guests currently staying: booking spans today, and isn't cancelled
        supabase.from('bookings').select('guests_count').lte('check_in', today).gt('check_out', today).in('status', ['confirmed', 'checked_in'])
      ]);

      // Occupancy = guests currently staying / total bed capacity across active rooms
      const totalCapacity = (roomsData || []).reduce((sum, r) => sum + (r.capacity || 0), 0);
      const guestsStaying = (occupiedTodayData || []).reduce((sum, b) => sum + (b.guests_count || 0), 0);
      const occupancyRate = totalCapacity > 0
        ? `${Math.min(100, Math.round((guestsStaying / totalCapacity) * 100))}%`
        : "N/A";

      setStats({
        totalBookings: totalBookings || 0,
        activeBookings: activeBookings || 0,
        checkinsToday: checkinsToday || 0,
        occupancyRate
      });

      if (bookingsData) setRecentBookings(bookingsData as any[]);
      if (checkinsData) setRecentCheckins(checkinsData as any[]);
      
      setLoading(false);
    }
    
    fetchDashboardData();
  }, [supabase]);

  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-waabi-green border-t-dark rounded-full animate-spin"></div>
      </div>
    );
  }

  const statCards = [
    { label: "Total Bookings", value: stats.totalBookings, icon: CalendarIcon, color: "bg-blue-50 text-blue-600" },
    { label: "Active Stays", value: stats.activeBookings, icon: BedDouble, color: "bg-waabi-green/20 text-waabi-green-dark" },
    { label: "Check-ins Today", value: stats.checkinsToday, icon: CheckCircle2, color: "bg-amber-50 text-amber-600" },
    { label: "Occupancy Rate", value: stats.occupancyRate, icon: TrendingUp, color: "bg-purple-50 text-purple-600" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-dark font-medium">Dashboard Overview</h1>
        <p className="text-dark/60 mt-2">Welcome to the Calcutta Backpackers property management system.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-dark/5 flex items-center gap-4">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-dark/50 text-xs font-bold uppercase tracking-wider mb-1">{stat.label}</p>
              <p className="text-3xl font-serif text-dark font-medium">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Bookings */}
        <div className="bg-white rounded-2xl shadow-sm border border-dark/5 overflow-hidden flex flex-col h-full">
          <div className="p-6 border-b border-dark/5 flex justify-between items-center bg-gray-50/50">
            <h2 className="font-serif text-xl text-dark">Recent Bookings</h2>
            <Link href="/admin/bookings" className="text-waabi-green-dark text-sm font-medium flex items-center gap-1 hover:underline">
              View All <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="flex-1 p-0 overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-dark/40 uppercase bg-white border-b border-dark/5">
                <tr>
                  <th className="px-6 py-4 font-bold">Guest</th>
                  <th className="px-6 py-4 font-bold">Room</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark/5">
                {recentBookings.length === 0 ? (
                  <tr><td colSpan={3} className="px-6 py-8 text-center text-dark/40">No recent bookings found.</td></tr>
                ) : (
                  recentBookings.map(booking => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-medium text-dark">{booking.guest_name}</p>
                        <p className="text-xs text-dark/50">{format(new Date(booking.check_in), 'MMM dd')} - {format(new Date(booking.check_out), 'MMM dd')}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-dark/80">{booking.room?.name || 'Unknown'}</p>
                        <p className="text-xs text-dark/50">{booking.guests_count} Guests</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                          booking.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                          booking.status === 'checked_in' ? 'bg-blue-100 text-blue-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {booking.status.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Check-ins */}
        <div className="bg-white rounded-2xl shadow-sm border border-dark/5 overflow-hidden flex flex-col h-full">
          <div className="p-6 border-b border-dark/5 flex justify-between items-center bg-gray-50/50">
            <h2 className="font-serif text-xl text-dark">Latest Check-ins</h2>
            <Link href="/admin/checkins" className="text-waabi-green-dark text-sm font-medium flex items-center gap-1 hover:underline">
              View All <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="flex-1 p-0 overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-dark/40 uppercase bg-white border-b border-dark/5">
                <tr>
                  <th className="px-6 py-4 font-bold">Guest Info</th>
                  <th className="px-6 py-4 font-bold">ID Details</th>
                  <th className="px-6 py-4 font-bold">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark/5">
                {recentCheckins.length === 0 ? (
                  <tr><td colSpan={3} className="px-6 py-8 text-center text-dark/40">No check-ins today.</td></tr>
                ) : (
                  recentCheckins.map(checkin => (
                    <tr key={checkin.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-medium text-dark">{checkin.full_name}</p>
                        <p className="text-xs text-dark/50">{checkin.nationality}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-dark/80">{checkin.id_type}</p>
                        <p className="text-xs text-dark/50 truncate w-24" title={checkin.id_number}>{checkin.id_number}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-dark/80">{format(new Date(checkin.created_at), 'hh:mm a')}</p>
                        <p className="text-xs text-dark/50">{format(new Date(checkin.created_at), 'MMM dd')}</p>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
