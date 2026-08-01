"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { format } from "date-fns";
import type { CheckIn } from "@/lib/types";
import { Search, FileSpreadsheet, Eye, X, Download, Archive, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import JSZip from "jszip";
import * as XLSX from "xlsx";

export default function CheckinsManager() {
  const [checkins, setCheckins] = useState<CheckIn[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedIdImage, setSelectedIdImage] = useState<string | null>(null);
  const [selectedGuestName, setSelectedGuestName] = useState<string>("id-document");

  // Fetches the image and forces a real download via a temporary blob link -
  // more reliable than a plain <a download> tag, which some browsers ignore
  // for cross-origin URLs (like Supabase Storage) without the right headers.
  const downloadImage = async (url: string, guestName: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const ext = url.split(".").pop()?.split("?")[0] || "jpg";
      const safeName = guestName.replace(/[^a-zA-Z0-9]+/g, "_");
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${safeName}_ID.${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed:", err);
      // Fall back to just opening it in a new tab if the fetch-and-download approach fails
      window.open(url, "_blank");
    }
  };
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

  const exportToExcel = () => {
    if (checkins.length === 0) {
      toast.error("No data to export");
      return;
    }
    const rows = checkins.map(c => ({
      "ID": c.id,
      "Booking Ref": c.booking_id || "N/A",
      "Guest Name": c.full_name,
      "Email": c.email,
      "Phone": c.phone,
      "Nationality": c.nationality,
      "ID Type": c.id_type,
      "ID Number": c.id_number,
      "Emergency Contact": c.emergency_contact,
      "Address": (c as any).address || "",
      "Visa No.": (c as any).visa_no || "",
      "Coming From": (c as any).coming_from || "",
      "Going To": (c as any).going_to || "",
      "Special Requests": c.special_requests || "",
      "Created At": c.created_at,
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Check-ins");
    XLSX.writeFile(workbook, `checkins_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
    toast.success("Exported to Excel");
  };

  const exportIdPhotosZip = async () => {
    const withPhotos = checkins.filter(c => (c as any).id_image_base64 || (c as any).id_image_back);
    if (withPhotos.length === 0) {
      toast.error("No ID photos to export");
      return;
    }

    const toastId = toast.loading(`Zipping ${withPhotos.length} guest(s)' ID photos...`);
    try {
      const zip = new JSZip();

      for (const c of withPhotos) {
        const safeName = (c.full_name || "guest").replace(/[^a-zA-Z0-9]+/g, "_");
        const front = (c as any).id_image_base64;
        const back = (c as any).id_image_back;

        if (front) {
          const res = await fetch(front);
          const blob = await res.blob();
          const ext = front.split(".").pop()?.split("?")[0] || "jpg";
          zip.file(`${safeName}_front.${ext}`, blob);
        }
        if (back) {
          const res = await fetch(back);
          const blob = await res.blob();
          const ext = back.split(".").pop()?.split("?")[0] || "jpg";
          zip.file(`${safeName}_back.${ext}`, blob);
        }
      }

      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const link = document.createElement("a");
      link.href = url;
      link.download = `id_photos_${format(new Date(), 'yyyy-MM-dd')}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("ID photos exported as ZIP", { id: toastId });
    } catch (err) {
      console.error("ZIP export failed:", err);
      toast.error("Failed to export ID photos", { id: toastId });
    }
  };

  const clearIdPhotoStorage = async () => {
    const confirmation = window.prompt(
      `This will PERMANENTLY DELETE all guest ID photo files from storage (front and back), for ALL check-ins. This cannot be undone. Room and blog photos are NOT affected.\n\nMake sure you've exported the ZIP above first if you need these photos.\n\nType DELETE to confirm:`
    );
    if (confirmation !== "DELETE") {
      if (confirmation !== null) toast.error("Confirmation text didn't match - nothing was deleted");
      return;
    }

    const toastId = toast.loading("Clearing ID photo storage...");
    try {
      const supabase = createClient();
      const filesToDelete: string[] = [];

      checkins.forEach(c => {
        const front = (c as any).id_image_base64;
        const back = (c as any).id_image_back;
        [front, back].forEach(url => {
          if (url) {
            // Extract just the filename from the full Supabase public URL
            const fileName = url.split("/uploads/")[1]?.split("?")[0];
            if (fileName) filesToDelete.push(fileName);
          }
        });
      });

      if (filesToDelete.length === 0) {
        toast.error("No files found to delete", { id: toastId });
        return;
      }

      const { error: storageError } = await supabase.storage.from("uploads").remove(filesToDelete);
      if (storageError) throw storageError;

      // Clear the now-broken links from the checkins table too, so the admin
      // panel doesn't show dead "view/download" buttons afterward.
      const { error: dbError } = await supabase
        .from("checkins")
        .update({ id_image_base64: null, id_image_back: null })
        .not("id", "is", null); // matches all rows

      if (dbError) throw dbError;

      toast.success(`Deleted ${filesToDelete.length} file(s) from storage`, { id: toastId });
      fetchCheckins();
    } catch (err) {
      console.error("Storage clear failed:", err);
      toast.error("Failed to clear storage", { id: toastId });
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif text-dark font-medium">Web Check-ins</h1>
          <p className="text-dark/60 mt-1">Review guest information before arrival</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={exportToExcel} className="btn-outline bg-white flex items-center gap-2">
            <FileSpreadsheet size={18} className="text-green-600" /> 
            Export to Excel
          </button>
          <button onClick={exportIdPhotosZip} className="btn-outline bg-white flex items-center gap-2">
            <Archive size={18} className="text-blue-600" /> 
            Export ID Photos (ZIP)
          </button>
          <button onClick={clearIdPhotoStorage} className="btn-outline bg-white flex items-center gap-2 !text-red-600 !border-red-200 hover:!bg-red-50">
            <Trash2 size={18} /> 
            Clear ID Photo Storage
          </button>
        </div>
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
                        <div className="flex items-center justify-end gap-3">
                          {(checkin as any).id_image_base64 && (
                            <div className="flex items-center gap-1">
                              <span className="text-[10px] font-bold text-dark/40 uppercase">Front</span>
                              <button 
                                onClick={() => {
                                  setSelectedIdImage((checkin as any).id_image_base64);
                                  setSelectedGuestName(checkin.full_name || "id-document");
                                }}
                                className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors flex items-center justify-center"
                                title="View Front"
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                onClick={() => downloadImage((checkin as any).id_image_base64, `${checkin.full_name || "id-document"}_front`)}
                                className="p-2 hover:bg-green-50 text-green-600 rounded-lg transition-colors flex items-center justify-center"
                                title="Download Front"
                              >
                                <Download size={16} />
                              </button>
                            </div>
                          )}
                          {(checkin as any).id_image_back && (
                            <div className="flex items-center gap-1">
                              <span className="text-[10px] font-bold text-dark/40 uppercase">Back</span>
                              <button 
                                onClick={() => {
                                  setSelectedIdImage((checkin as any).id_image_back);
                                  setSelectedGuestName(checkin.full_name || "id-document");
                                }}
                                className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors flex items-center justify-center"
                                title="View Back"
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                onClick={() => downloadImage((checkin as any).id_image_back, `${checkin.full_name || "id-document"}_back`)}
                                className="p-2 hover:bg-green-50 text-green-600 rounded-lg transition-colors flex items-center justify-center"
                                title="Download Back"
                              >
                                <Download size={16} />
                              </button>
                            </div>
                          )}
                        </div>
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
            <h3 className="font-serif text-xl text-dark mb-4 px-2 flex items-center justify-between">
              Identity Document
              <button
                onClick={() => downloadImage(selectedIdImage, selectedGuestName)}
                className="flex items-center gap-2 text-sm bg-dark text-white px-4 py-2 rounded-full hover:bg-waabi-green-dark transition-colors"
              >
                <Download size={16} /> Download
              </button>
            </h3>
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
