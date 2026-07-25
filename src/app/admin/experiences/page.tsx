"use client";

import { useState, useEffect } from "react";
import type { Experience } from "@/lib/types";
import { uploadFileToStorage, createClient } from "@/lib/supabase/client";
import { Plus, Edit2, Trash2, CheckCircle2, XCircle, X } from "lucide-react";
import toast from "react-hot-toast";

export default function ExperiencesManager() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "Culture",
    description: "",
    image: "",
    price: 0,
    duration: "",
    is_active: true
  });

  const supabase = createClient();

  const fetchExperiences = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('experiences').select('*').order('sort_order', { ascending: true });
    if (data) setExperiences(data);
    if (error) toast.error("Failed to fetch experiences");
    setLoading(false);
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const toggleActive = async (id: string, currentStatus: boolean) => {
    const toastId = toast.loading("Updating status...");
    const { error } = await supabase.from('experiences').update({ is_active: !currentStatus }).eq('id', id);
    if (error) toast.error("Failed to update status", { id: toastId });
    else {
      toast.success("Status updated", { id: toastId });
      setExperiences(experiences.map(e => e.id === id ? { ...e, is_active: !currentStatus } : e));
    }
  };
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const toastId = toast.loading("Uploading image...");
    const url = await uploadFileToStorage(file, 'uploads');
    
    if (url) {
      setFormData({ ...formData, image: url });
      toast.success("Image uploaded successfully!", { id: toastId });
    } else {
      toast.error("Failed to upload image. Did you create the 'uploads' bucket?", { id: toastId });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this experience?")) return;
    const toastId = toast.loading("Deleting experience...");
    const { error } = await supabase.from('experiences').delete().eq('id', id);
    if (error) toast.error("Failed to delete experience", { id: toastId });
    else {
      toast.success("Experience deleted", { id: toastId });
      setExperiences(experiences.filter(e => e.id !== id));
    }
  };

  const handleOpenModal = (exp?: Experience) => {
    if (exp) {
      setEditingExp(exp);
      setFormData({
        title: exp.title,
        slug: exp.slug,
        category: exp.category,
        description: exp.description,
        image: exp.image,
        price: exp.price || 0,
        duration: exp.duration || "",
        is_active: exp.is_active
      });
    } else {
      setEditingExp(null);
      setFormData({
        title: "",
        slug: "",
        category: "Culture",
        description: "",
        image: "",
        price: 500,
        duration: "2 hours",
        is_active: true
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading("Saving experience...");
    
    let finalSlug = formData.slug;
    if (!finalSlug) {
      finalSlug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    const payload = {
      title: formData.title,
      slug: finalSlug,
      category: formData.category,
      description: formData.description,
      image: formData.image,
      price: Number(formData.price),
      duration: formData.duration,
      is_active: formData.is_active
    };

    if (editingExp) {
      const { error } = await supabase.from('experiences').update(payload).eq('id', editingExp.id);
      if (error) toast.error("Failed to update experience", { id: toastId });
      else {
        toast.success("Experience updated", { id: toastId });
        setIsModalOpen(false);
        fetchExperiences();
      }
    } else {
      const { error } = await supabase.from('experiences').insert(payload);
      if (error) toast.error("Failed to create experience", { id: toastId });
      else {
        toast.success("Experience created", { id: toastId });
        setIsModalOpen(false);
        fetchExperiences();
      }
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif text-dark font-medium">Experiences Manager</h1>
          <p className="text-dark/60 mt-1">Manage WanderXP tours and activities</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> New Experience
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-dark/5 overflow-hidden min-h-[500px]">
        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-waabi-green border-t-dark rounded-full animate-spin"></div>
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-dark/40 uppercase bg-gray-50/50 border-b border-dark/5">
                <tr>
                  <th className="px-6 py-4 font-bold">Experience Details</th>
                  <th className="px-6 py-4 font-bold">Price & Duration</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark/5">
                {experiences.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-12 text-center text-dark/40">No experiences found.</td></tr>
                ) : (
                  experiences.map(exp => (
                    <tr key={exp.id} className={`hover:bg-gray-50/50 transition-colors ${!exp.is_active ? 'opacity-60 bg-gray-50' : ''}`}>
                      <td className="px-6 py-4">
                        <p className="font-bold text-dark text-base">{exp.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-dark/50 bg-dark/5 px-2 py-0.5 rounded">{exp.category}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-dark">₹{exp.price}</p>
                        <p className="text-xs text-dark/60 mt-1">{exp.duration}</p>
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => toggleActive(exp.id, exp.is_active)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full uppercase tracking-wider transition-colors ${
                            exp.is_active ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}
                        >
                          {exp.is_active ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                          {exp.is_active ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleOpenModal(exp)} className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDelete(exp.id)} className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors">
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

      {/* Experience Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-dark/50 hover:text-dark transition-colors"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-serif text-dark mb-6">{editingExp ? 'Edit Experience' : 'New Experience'}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-dark/70 uppercase tracking-wider mb-2">Title *</label>
                  <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-waabi-bg border border-dark/10 rounded-xl px-4 py-3 text-dark focus:outline-none focus:border-waabi-green-dark" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-dark/70 uppercase tracking-wider mb-2">Slug</label>
                  <input type="text" placeholder="Auto-generated" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full bg-waabi-bg border border-dark/10 rounded-xl px-4 py-3 text-dark focus:outline-none focus:border-waabi-green-dark" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-dark/70 uppercase tracking-wider mb-2">Category *</label>
                  <input required type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-waabi-bg border border-dark/10 rounded-xl px-4 py-3 text-dark focus:outline-none focus:border-waabi-green-dark" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-dark/70 uppercase tracking-wider mb-2">Price (₹) *</label>
                  <input required type="number" min="0" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full bg-waabi-bg border border-dark/10 rounded-xl px-4 py-3 text-dark focus:outline-none focus:border-waabi-green-dark" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-dark/70 uppercase tracking-wider mb-2">Duration</label>
                  <input type="text" placeholder="e.g. 3 hours" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} className="w-full bg-waabi-bg border border-dark/10 rounded-xl px-4 py-3 text-dark focus:outline-none focus:border-waabi-green-dark" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-dark/70 uppercase tracking-wider mb-2">Image</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full bg-waabi-bg border border-dark/10 rounded-xl px-4 py-2.5 text-dark focus:outline-none focus:border-waabi-green-dark file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-waabi-green/20 file:text-waabi-green-dark" />
                {formData.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={formData.image} alt="Preview" className="h-24 w-auto rounded-lg mt-3 object-cover shadow-sm border border-dark/10" />
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-dark/70 uppercase tracking-wider mb-2">Description *</label>
                <textarea required rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-waabi-bg border border-dark/10 rounded-xl px-4 py-3 text-dark focus:outline-none focus:border-waabi-green-dark resize-none" />
              </div>

              <div className="flex items-center gap-3 py-2">
                <input type="checkbox" id="is_active" checked={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.checked})} className="w-5 h-5 accent-waabi-green-dark" />
                <label htmlFor="is_active" className="font-bold text-dark cursor-pointer">Active (Visible on site)</label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-dark/5">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 font-semibold text-dark/60 hover:text-dark">Cancel</button>
                <button type="submit" className="btn-primary shadow-lg">{editingExp ? 'Update Experience' : 'Save Experience'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
