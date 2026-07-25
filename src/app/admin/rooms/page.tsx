"use client";

import { useState, useEffect } from "react";
import type { Room } from "@/lib/types";
import { uploadFileToStorage, createClient } from "@/lib/supabase/client";
import { Plus, Edit2, Trash2, CheckCircle2, XCircle, X } from "lucide-react";
import toast from "react-hot-toast";

export default function RoomsManager() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    tagline: "",
    description: "",
    price_per_night: 0,
    capacity: 1,
    features: [] as string[],
    images: [] as string[]
  });

  const supabase = createClient();

  const fetchRooms = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('rooms').select('*').order('sort_order', { ascending: true });
    if (data) setRooms(data);
    if (error) toast.error("Failed to fetch rooms");
    setLoading(false);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const toggleActive = async (id: string, currentStatus: boolean) => {
    const toastId = toast.loading("Updating status...");
    const { error } = await supabase.from('rooms').update({ is_active: !currentStatus }).eq('id', id);
    if (error) toast.error("Failed to update status", { id: toastId });
    else {
      toast.success("Room status updated", { id: toastId });
      setRooms(rooms.map(r => r.id === id ? { ...r, is_active: !currentStatus } : r));
    }
  };
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const toastId = toast.loading("Uploading image...");
    const url = await uploadFileToStorage(file, 'uploads');
    
    if (url) {
      setFormData({ ...formData, images: [url] });
      toast.success("Image uploaded successfully!", { id: toastId });
    } else {
      toast.error("Failed to upload image. Did you create the 'uploads' bucket?", { id: toastId });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;
    const toastId = toast.loading("Deleting room...");
    const { error } = await supabase.from('rooms').delete().eq('id', id);
    if (error) toast.error("Failed to delete room", { id: toastId });
    else {
      toast.success("Room deleted", { id: toastId });
      setRooms(rooms.filter(r => r.id !== id));
    }
  };

  const handleOpenModal = (room?: Room) => {
    if (room) {
      setEditingRoom(room);
      setFormData({
        name: room.name,
        slug: room.slug,
        tagline: room.tagline,
        description: room.description,
        price_per_night: room.price_per_night,
        capacity: room.capacity,
        features: room.features || [],
        images: room.images || []
      });
    } else {
      setEditingRoom(null);
      setFormData({
        name: "",
        slug: "",
        tagline: "",
        description: "",
        price_per_night: 500,
        capacity: 1,
        features: [],
        images: []
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading("Saving room...");
    
    // Auto-generate slug if empty
    let finalSlug = formData.slug;
    if (!finalSlug) {
      finalSlug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    const payload = {
      name: formData.name,
      slug: finalSlug,
      tagline: formData.tagline,
      description: formData.description,
      price_per_night: Number(formData.price_per_night),
      capacity: Number(formData.capacity),
      features: formData.features,
      images: formData.images
    };

    if (editingRoom) {
      const { error } = await supabase.from('rooms').update(payload).eq('id', editingRoom.id);
      if (error) toast.error("Failed to update room", { id: toastId });
      else {
        toast.success("Room updated successfully", { id: toastId });
        setIsModalOpen(false);
        fetchRooms();
      }
    } else {
      const { error } = await supabase.from('rooms').insert(payload);
      if (error) toast.error("Failed to create room", { id: toastId });
      else {
        toast.success("Room created successfully", { id: toastId });
        setIsModalOpen(false);
        fetchRooms();
      }
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif text-dark font-medium">Rooms & Rates</h1>
          <p className="text-dark/60 mt-1">Manage your accommodations and pricing</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Add New Room
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
                  <th className="px-6 py-4 font-bold">Room Name</th>
                  <th className="px-6 py-4 font-bold">Capacity</th>
                  <th className="px-6 py-4 font-bold">Base Price (₹)</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark/5">
                {rooms.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-dark/40">No rooms configured.</td></tr>
                ) : (
                  rooms.map(room => (
                    <tr key={room.id} className={`hover:bg-gray-50/50 transition-colors ${!room.is_active ? 'opacity-60 bg-gray-50' : ''}`}>
                      <td className="px-6 py-4">
                        <p className="font-bold text-dark text-base">{room.name}</p>
                        <p className="text-xs text-dark/50 mt-1 truncate max-w-xs">{room.tagline}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-dark bg-gray-100 px-3 py-1 rounded-full">{room.capacity} Guests</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-lg">₹{room.price_per_night}</span><span className="text-xs text-dark/40">/night</span>
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => toggleActive(room.id, room.is_active)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full uppercase tracking-wider transition-colors ${
                            room.is_active ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}
                        >
                          {room.is_active ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                          {room.is_active ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleOpenModal(room)} className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDelete(room.id)} className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors">
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

      {/* Room Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-dark/50 hover:text-dark transition-colors"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-serif text-dark mb-6">{editingRoom ? 'Edit Room' : 'Add New Room'}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-dark/70 uppercase tracking-wider mb-2">Room Name *</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-waabi-bg border border-dark/10 rounded-xl px-4 py-3 text-dark focus:outline-none focus:border-waabi-green-dark" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-dark/70 uppercase tracking-wider mb-2">Slug (URL friendly)</label>
                  <input type="text" placeholder="Auto-generated if empty" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full bg-waabi-bg border border-dark/10 rounded-xl px-4 py-3 text-dark focus:outline-none focus:border-waabi-green-dark" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-dark/70 uppercase tracking-wider mb-2">Capacity (Guests) *</label>
                  <input required type="number" min="1" value={formData.capacity} onChange={e => setFormData({...formData, capacity: Number(e.target.value)})} className="w-full bg-waabi-bg border border-dark/10 rounded-xl px-4 py-3 text-dark focus:outline-none focus:border-waabi-green-dark" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-dark/70 uppercase tracking-wider mb-2">Price Per Night (₹) *</label>
                  <input required type="number" min="0" value={formData.price_per_night} onChange={e => setFormData({...formData, price_per_night: Number(e.target.value)})} className="w-full bg-waabi-bg border border-dark/10 rounded-xl px-4 py-3 text-dark focus:outline-none focus:border-waabi-green-dark" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-dark/70 uppercase tracking-wider mb-2">Tagline</label>
                <input type="text" value={formData.tagline} onChange={e => setFormData({...formData, tagline: e.target.value})} className="w-full bg-waabi-bg border border-dark/10 rounded-xl px-4 py-3 text-dark focus:outline-none focus:border-waabi-green-dark" />
              </div>

              <div>
                <label className="block text-xs font-bold text-dark/70 uppercase tracking-wider mb-2">Description</label>
                <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-waabi-bg border border-dark/10 rounded-xl px-4 py-3 text-dark focus:outline-none focus:border-waabi-green-dark resize-none" />
              </div>

              <div>
                <label className="block text-xs font-bold text-dark/70 uppercase tracking-wider mb-2">Room Image</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full bg-waabi-bg border border-dark/10 rounded-xl px-4 py-2.5 text-dark focus:outline-none focus:border-waabi-green-dark file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-waabi-green/20 file:text-waabi-green-dark" />
                {formData.images[0] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={formData.images[0]} alt="Preview" className="h-24 w-auto rounded-lg mt-3 object-cover shadow-sm border border-dark/10" />
                )}
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-dark/5">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 font-semibold text-dark/60 hover:text-dark">Cancel</button>
                <button type="submit" className="btn-primary shadow-lg">{editingRoom ? 'Update Room' : 'Create Room'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
