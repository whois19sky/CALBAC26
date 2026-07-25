"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Save } from "lucide-react";
import toast from "react-hot-toast";

export default function SettingsManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    contact: {
      phone: "",
      email: "",
      whatsapp: "",
      address: ""
    },
    social: {
      instagram: "",
      facebook: ""
    },
    hero: {
      video_url: ""
    },
    partners: {
      company_name: ""
    }
  });

  const supabase = createClient();

  const fetchSettings = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('site_settings').select('*');
    if (data) {
      const contactObj = data.find(s => s.key === 'contact_info')?.value || {};
      const socialObj = data.find(s => s.key === 'social_links')?.value || {};
      const heroObj = data.find(s => s.key === 'hero_settings')?.value || {};
      const partnersObj = data.find(s => s.key === 'partners_settings')?.value || {};
      
      setFormData({
        contact: {
          phone: contactObj.phone || "",
          email: contactObj.email || "",
          whatsapp: contactObj.whatsapp || "",
          address: contactObj.address || ""
        },
        social: {
          instagram: socialObj.instagram || "",
          facebook: socialObj.facebook || ""
        },
        hero: {
          video_url: heroObj.video_url || ""
        },
        partners: {
          company_name: partnersObj.company_name || ""
        }
      });
    }
    if (error) toast.error("Failed to fetch settings");
    setLoading(false);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleUpdate = (section: keyof typeof formData, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const toastId = toast.loading("Saving settings...");
    
    try {
      // Upsert contact_info
      await supabase.from('site_settings').upsert({ 
        id: '11111111-1111-1111-1111-111111111111', // Dummy UUID used in seed
        key: 'contact_info', 
        value: formData.contact 
      }, { onConflict: 'key' });
      
      // Upsert social_links
      await supabase.from('site_settings').upsert({ 
        id: '22222222-2222-2222-2222-222222222222',
        key: 'social_links', 
        value: formData.social 
      }, { onConflict: 'key' });

      // Upsert hero_settings
      await supabase.from('site_settings').upsert({ 
        id: '33333333-3333-3333-3333-333333333333',
        key: 'hero_settings', 
        value: formData.hero 
      }, { onConflict: 'key' });

      // Upsert partners_settings
      await supabase.from('site_settings').upsert({ 
        id: '44444444-4444-4444-4444-444444444444',
        key: 'partners_settings', 
        value: formData.partners 
      }, { onConflict: 'key' });

      toast.success("Settings saved successfully!", { id: toastId });
    } catch (error) {
      toast.error("Failed to save settings", { id: toastId });
    }
    
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-4 border-waabi-green border-t-dark rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif text-dark font-medium">Site Settings</h1>
          <p className="text-dark/60 mt-1">Manage global website configuration</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-dark/5 p-6 md:p-8">
          <h2 className="text-xl font-serif text-dark mb-6">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-dark/70 uppercase tracking-wider mb-2">Phone Number</label>
              <input type="text" value={formData.contact.phone} onChange={e => handleUpdate('contact', 'phone', e.target.value)} className="w-full bg-waabi-bg border border-dark/10 rounded-xl px-4 py-3 text-dark focus:outline-none focus:border-waabi-green-dark" />
            </div>
            <div>
              <label className="block text-xs font-bold text-dark/70 uppercase tracking-wider mb-2">WhatsApp Number</label>
              <input type="text" value={formData.contact.whatsapp} onChange={e => handleUpdate('contact', 'whatsapp', e.target.value)} className="w-full bg-waabi-bg border border-dark/10 rounded-xl px-4 py-3 text-dark focus:outline-none focus:border-waabi-green-dark" />
            </div>
            <div>
              <label className="block text-xs font-bold text-dark/70 uppercase tracking-wider mb-2">Email Address</label>
              <input type="email" value={formData.contact.email} onChange={e => handleUpdate('contact', 'email', e.target.value)} className="w-full bg-waabi-bg border border-dark/10 rounded-xl px-4 py-3 text-dark focus:outline-none focus:border-waabi-green-dark" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-dark/70 uppercase tracking-wider mb-2">Physical Address</label>
              <textarea rows={2} value={formData.contact.address} onChange={e => handleUpdate('contact', 'address', e.target.value)} className="w-full bg-waabi-bg border border-dark/10 rounded-xl px-4 py-3 text-dark focus:outline-none focus:border-waabi-green-dark resize-none" />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white rounded-2xl shadow-sm border border-dark/5 p-6 md:p-8">
          <h2 className="text-xl font-serif text-dark mb-6">Social Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-dark/70 uppercase tracking-wider mb-2">Instagram URL</label>
              <input type="text" value={formData.social.instagram} onChange={e => handleUpdate('social', 'instagram', e.target.value)} className="w-full bg-waabi-bg border border-dark/10 rounded-xl px-4 py-3 text-dark focus:outline-none focus:border-waabi-green-dark" />
            </div>
            <div>
              <label className="block text-xs font-bold text-dark/70 uppercase tracking-wider mb-2">Facebook URL</label>
              <input type="text" value={formData.social.facebook} onChange={e => handleUpdate('social', 'facebook', e.target.value)} className="w-full bg-waabi-bg border border-dark/10 rounded-xl px-4 py-3 text-dark focus:outline-none focus:border-waabi-green-dark" />
            </div>
          </div>
        </div>

        {/* Homepage Hero */}
        <div className="bg-white rounded-2xl shadow-sm border border-dark/5 p-6 md:p-8">
          <h2 className="text-xl font-serif text-dark mb-6">Homepage Hero Section</h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-xs font-bold text-dark/70 uppercase tracking-wider mb-2">Background Video URL (MP4)</label>
              <input type="text" placeholder="/videos/hero-bg.mp4" value={formData.hero.video_url} onChange={e => handleUpdate('hero', 'video_url', e.target.value)} className="w-full bg-waabi-bg border border-dark/10 rounded-xl px-4 py-3 text-dark focus:outline-none focus:border-waabi-green-dark" />
              <p className="text-xs text-dark/40 mt-2">Provide a valid URL to an MP4 file. Can be a local path or external URL.</p>
            </div>
          </div>
        </div>

        {/* WanderXP Partners */}
        <div className="bg-white rounded-2xl shadow-sm border border-dark/5 p-6 md:p-8">
          <h2 className="text-xl font-serif text-dark mb-6">WanderXP Partners</h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-xs font-bold text-dark/70 uppercase tracking-wider mb-2">Primary Partner Company Name</label>
              <input type="text" placeholder="e.g. Calcutta Walks" value={formData.partners.company_name} onChange={e => handleUpdate('partners', 'company_name', e.target.value)} className="w-full bg-waabi-bg border border-dark/10 rounded-xl px-4 py-3 text-dark focus:outline-none focus:border-waabi-green-dark" />
              <p className="text-xs text-dark/40 mt-2">This name will be displayed on the WanderXP front page.</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" disabled={saving} className="btn-primary shadow-lg flex items-center gap-2 px-8">
            {saving ? (
              <span className="w-5 h-5 border-2 border-dark/20 border-t-dark rounded-full animate-spin block"></span>
            ) : (
              <><Save size={18} /> Save All Settings</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
