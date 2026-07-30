"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { format } from "date-fns";
import type { CheckIn } from "@/lib/types";
import { Search, FileSpreadsheet, Eye, X } from "lucide-react";
import toast from "react-hot-toast";

export default function CheckinsManager() {
  const [checkins, setCheckins] = useState<CheckIn[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedIdImage, setSelectedIdImage] = useState<string | null>(null);
  const supabase = createClient();

  const fetchCheckins = async () => {
    setLoading(true);
    let query = supabase.from('checkins').select('*, booking:bookings(check_in, check_out, room_name, room:rooms(name))').order('created_at', { ascending: false });
    
    if (search) {
      query = query.ilike('full_name', `%${search}%`);
    }

    const { data, error } = await query;
    if (data) setCheckins(data as any[]);
    if (error) toast.error("Failed to fetch check-ins");
    setLoading(false);
  };

  useEffect(() => {
    fetchCheckins();
  }, [search]);

  const exportToCSV = () => {
    if (checkins.length === 0) {
      toast.error("No data to export");
      return;
    }
    const headers = ["ID", "Booking Ref", "Guest Name", "Email", "Phone", "Nationality", "ID Type", "ID Number", "Emergency Contact", "Special Requests", "Created At"];
    const csvContent = [
      headers.join(","),
      ...checkins.map(c => [
        c.id,
        c.booking_id || "N/A",
        `"${c.full_name}"`,
        c.email,
        `'${c.phone}`,
        c.nationality,
        c.id_type,
        c.id_number,
        `"${c.emergency_contact}"`,
        `"${c.special_requests || ""}"`,
        c.created_at
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `checkins_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif text-dark font-medium">Web Check-ins</h1>
          <p className="text-dark/60 mt-1">Review guest information before arrival</p>
        </div>
        <button onClick={exportToCSV} className="btn-outline bg-white flex items-center gap-2">
          <FileSpreadsheet size={18} className="text-green-600" /> 
          Export to Sheets
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-dark/5 overflow-hidden flex flex-col min-h-[600px]">
        {/* Toolbar */}
        <div className="p-4 border-b border-dark/5 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative w-full sm:w-96">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark/40" />
            <input 
              type="text" 
              placeholder="Search guest name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-dark/10 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-waabi-green-dark transition-colors"
            />
          </div>
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
                  <th className="px-6 py-4 font-bold">Guest Details</th>
                  <th className="px-6 py-4 font-bold">Identity Document</th>
                  <th className="px-6 py-4 font-bold">Emergency Contact</th>
                  <th className="px-6 py-4 font-bold">Booking Details</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark/5">
                {checkins.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-dark/40">No check-ins found.</td></tr>
                ) : (
                  checkins.map(checkin => (
                    <tr key={checkin.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-dark text-base">{checkin.full_name}</p>
                        <p className="text-xs text-dark/60 mt-1">{checkin.email}</p>
                        <p className="text-xs text-dark/60">{checkin.phone}</p>
                        <span className="inline-block mt-2 px-2 py-0.5 bg-gray-100 text-dark/60 text-[10px] rounded uppercase font-bold tracking-wider">{checkin.nationality}</span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-dark">{checkin.id_type}</p>
                        <p className="text-sm font-mono text-dark/60 mt-1">{checkin.id_number}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-dark/80 whitespace-pre-line">{checkin.emergency_contact}</p>
                      </td>
                      <td className="px-6 py-4">
                        {checkin.booking ? (
                          <>
                            <p className="text-sm font-medium text-dark">{(checkin.booking as any).room_name || (checkin.booking as any).room?.name}</p>
                            <div className="text-xs text-dark/60 mt-1">
                              {(() => {
                                const ci = (checkin.booking as any).check_in;
                                const co = (checkin.booking as any).check_out;
                                const ciDate = ci ? new Date(ci) : null;
                                const coDate = co ? new Date(co) : null;
                                const validCi = ciDate && !isNaN(ciDate.getTime());
                                const validCo = coDate && !isNaN(coDate.getTime());
                                if (!validCi || !validCo) return "Dates unavailable";
                                return `${format(ciDate as Date, 'MMM dd')} - ${format(coDate as Date, 'MMM dd')}`;
                              })()}
                            </div>
                          </>
                        ) : (
                          <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-md">No Booking Linked</span>
                        )}
                        {checkin.special_requests && (
                          <div className="mt-2 text-[10px] text-waabi-green-dark bg-waabi-green/10 p-2 rounded line-clamp-2" title={checkin.special_requests}>
                            {checkin.special_requests}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {(checkin as any).id_image_base64 && (
                          <button 
                            onClick={() => setSelectedIdImage((checkin as any).id_image_base64)}
                            className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors flex items-center justify-center ml-auto"
                            title="View ID Photo"
                          >
                            <Eye size={18} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ID Image Modal */}
      {selectedIdImage && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-4 max-w-2xl w-full relative">
            <button 
              onClick={() => setSelectedIdImage(null)}
              className="absolute -top-4 -right-4 bg-white text-dark p-2 rounded-full shadow-lg hover:scale-105 transition-transform"
            >
              <X size={20} />
            </button>
            <h3 className="font-serif text-xl text-dark mb-4 px-2">Identity Document</h3>
            <div className="w-full overflow-hidden rounded-xl bg-gray-100 flex items-center justify-center min-h-[300px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={selectedIdImage} alt="ID Document" className="max-w-full max-h-[70vh] object-contain" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
