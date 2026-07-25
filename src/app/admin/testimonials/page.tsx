"use client";

import { useState, useEffect } from "react";
import type { Testimonial } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { Plus, Edit2, Trash2, CheckCircle2, XCircle, X, Star } from "lucide-react";
import toast from "react-hot-toast";

export default function TestimonialsManager() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);

  const [formData, setFormData] = useState({
    quote: "",
    guest_name: "",
    origin: "",
    rating: 5,
    is_active: true,
  });

  const supabase = createClient();

  const fetchTestimonials = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("sort_order", { ascending: true });
    if (data) setTestimonials(data);
    if (error) toast.error("Failed to fetch testimonials");
    setLoading(false);
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const toggleActive = async (id: string, currentStatus: boolean) => {
    const toastId = toast.loading("Updating status...");
    const { error } = await supabase.from("testimonials").update({ is_active: !currentStatus }).eq("id", id);
    if (error) toast.error("Failed to update status", { id: toastId });
    else {
      toast.success("Status updated", { id: toastId });
      setTestimonials(testimonials.map(t => (t.id === id ? { ...t, is_active: !currentStatus } : t)));
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) return;
    const toastId = toast.loading("Deleting testimonial...");
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) toast.error("Failed to delete testimonial", { id: toastId });
    else {
      toast.success("Testimonial deleted", { id: toastId });
      setTestimonials(testimonials.filter(t => t.id !== id));
    }
  };

  const handleOpenModal = (item?: Testimonial) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        quote: item.quote,
        guest_name: item.guest_name,
        origin: item.origin,
        rating: item.rating,
        is_active: item.is_active,
      });
    } else {
      setEditingItem(null);
      setFormData({ quote: "", guest_name: "", origin: "", rating: 5, is_active: true });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading("Saving testimonial...");

    const payload = {
      quote: formData.quote,
      guest_name: formData.guest_name,
      origin: formData.origin,
      rating: Number(formData.rating),
      is_active: formData.is_active,
    };

    if (editingItem) {
      const { error } = await supabase.from("testimonials").update(payload).eq("id", editingItem.id);
      if (error) toast.error("Failed to update testimonial", { id: toastId });
      else {
        toast.success("Testimonial updated", { id: toastId });
        setIsModalOpen(false);
        fetchTestimonials();
      }
    } else {
      const { error } = await supabase.from("testimonials").insert(payload);
      if (error) toast.error("Failed to create testimonial", { id: toastId });
      else {
        toast.success("Testimonial created", { id: toastId });
        setIsModalOpen(false);
        fetchTestimonials();
      }
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif text-dark font-medium">Testimonials Manager</h1>
          <p className="text-dark/60 mt-1">Manage guest reviews shown on the homepage</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> New Testimonial
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-dark/5 overflow-hidden min-h-[500px]">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-waabi-green border-t-dark rounded-full animate-spin"></div>
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-dark/40 uppercase bg-gray-50/50 border-b border-dark/5">
                <tr>
                  <th className="px-6 py-4 font-bold">Guest</th>
                  <th className="px-6 py-4 font-bold">Quote</th>
                  <th className="px-6 py-4 font-bold">Rating</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark/5">
                {testimonials.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-dark/40">No testimonials found.</td>
                  </tr>
                ) : (
                  testimonials.map(item => (
                    <tr key={item.id} className={`hover:bg-gray-50/50 transition-colors ${!item.is_active ? "opacity-60 bg-gray-50" : ""}`}>
                      <td className="px-6 py-4">
                        <p className="font-bold text-dark text-base">{item.guest_name}</p>
                        <p className="text-xs text-dark/50 mt-1">{item.origin}</p>
                      </td>
                      <td className="px-6 py-4 max-w-sm">
                        <p className="text-dark/70 text-sm line-clamp-2">&ldquo;{item.quote}&rdquo;</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-waabi-green-dark">
                          {Array.from({ length: item.rating }).map((_, i) => (
                            <Star key={i} size={14} fill="currentColor" />
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleActive(item.id, item.is_active)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full uppercase tracking-wider transition-colors ${
                            item.is_active ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                          }`}
                        >
                          {item.is_active ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                          {item.is_active ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleOpenModal(item)} className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDelete(item.id)} className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors">
                            <Trash2 size={16} />
                          </button>
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-dark/50 hover:text-dark transition-colors">
              <X size={24} />
            </button>
            <h2 className="text-2xl font-serif text-dark mb-6">{editingItem ? "Edit Testimonial" : "New Testimonial"}</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-dark/70 uppercase tracking-wider mb-2">Guest Name *</label>
                  <input required type="text" value={formData.guest_name} onChange={e => setFormData({ ...formData, guest_name: e.target.value })} className="w-full bg-waabi-bg border border-dark/10 rounded-xl px-4 py-3 text-dark focus:outline-none focus:border-waabi-green-dark" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-dark/70 uppercase tracking-wider mb-2">Origin (City, Country)</label>
                  <input type="text" placeholder="e.g. Melbourne, Australia" value={formData.origin} onChange={e => setFormData({ ...formData, origin: e.target.value })} className="w-full bg-waabi-bg border border-dark/10 rounded-xl px-4 py-3 text-dark focus:outline-none focus:border-waabi-green-dark" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-dark/70 uppercase tracking-wider mb-2">Rating (1–5) *</label>
                  <input required type="number" min="1" max="5" value={formData.rating} onChange={e => setFormData({ ...formData, rating: Number(e.target.value) })} className="w-full bg-waabi-bg border border-dark/10 rounded-xl px-4 py-3 text-dark focus:outline-none focus:border-waabi-green-dark" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-dark/70 uppercase tracking-wider mb-2">Quote *</label>
                <textarea required rows={4} value={formData.quote} onChange={e => setFormData({ ...formData, quote: e.target.value })} className="w-full bg-waabi-bg border border-dark/10 rounded-xl px-4 py-3 text-dark focus:outline-none focus:border-waabi-green-dark resize-none" />
              </div>

              <div className="flex items-center gap-3 py-2">
                <input type="checkbox" id="is_active" checked={formData.is_active} onChange={e => setFormData({ ...formData, is_active: e.target.checked })} className="w-5 h-5 accent-waabi-green-dark" />
                <label htmlFor="is_active" className="font-bold text-dark cursor-pointer">Active (Visible on site)</label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-dark/5">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 font-semibold text-dark/60 hover:text-dark">Cancel</button>
                <button type="submit" className="btn-primary shadow-lg">{editingItem ? "Update Testimonial" : "Save Testimonial"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
