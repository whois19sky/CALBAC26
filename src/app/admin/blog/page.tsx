"use client";

import { useState, useEffect } from "react";
import type { BlogPost } from "@/lib/types";
import { uploadFileToStorage, createClient } from "@/lib/supabase/client";
import { Plus, Edit2, Trash2, CheckCircle2, XCircle, X } from "lucide-react";
import toast from "react-hot-toast";
import { format } from "date-fns";

export default function BlogManager() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "General",
    author: "Calcutta Backpackers",
    cover_image: "",
    is_published: false
  });

  const supabase = createClient();

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
    if (data) setPosts(data);
    if (error) toast.error("Failed to fetch blog posts");
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const togglePublish = async (id: string, currentStatus: boolean) => {
    const toastId = toast.loading("Updating status...");
    const payload = { 
      is_published: !currentStatus,
      published_at: !currentStatus ? new Date().toISOString() : null
    };
    const { error } = await supabase.from('blog_posts').update(payload).eq('id', id);
    if (error) toast.error("Failed to update status", { id: toastId });
    else {
      toast.success("Post status updated", { id: toastId });
      setPosts(posts.map(p => p.id === id ? { ...p, ...payload } : p));
    }
  };
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const toastId = toast.loading("Uploading cover image...");
    const url = await uploadFileToStorage(file, 'uploads');
    
    if (url) {
      setFormData({ ...formData, cover_image: url });
      toast.success("Cover image uploaded successfully!", { id: toastId });
    } else {
      toast.error("Failed to upload image. Did you create the 'uploads' bucket?", { id: toastId });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    const toastId = toast.loading("Deleting post...");
    const { error } = await supabase.from('blog_posts').delete().eq('id', id);
    if (error) toast.error("Failed to delete post", { id: toastId });
    else {
      toast.success("Post deleted", { id: toastId });
      setPosts(posts.filter(p => p.id !== id));
    }
  };

  const handleOpenModal = (post?: BlogPost) => {
    if (post) {
      setEditingPost(post);
      setFormData({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        category: post.category,
        author: post.author || "Calcutta Backpackers",
        cover_image: post.cover_image || "",
        is_published: post.is_published
      });
    } else {
      setEditingPost(null);
      setFormData({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        category: "General",
        author: "Calcutta Backpackers",
        cover_image: "",
        is_published: false
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading("Saving post...");
    
    let finalSlug = formData.slug;
    if (!finalSlug) {
      finalSlug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    const payload = {
      title: formData.title,
      slug: finalSlug,
      excerpt: formData.excerpt,
      content: formData.content,
      category: formData.category,
      author: formData.author,
      cover_image: formData.cover_image,
      is_published: formData.is_published,
      published_at: formData.is_published ? new Date().toISOString() : null
    };

    if (editingPost) {
      // don't overwrite original published_at if already published
      if (editingPost.is_published && formData.is_published) {
        delete (payload as any).published_at;
      }
      
      const { error } = await supabase.from('blog_posts').update(payload).eq('id', editingPost.id);
      if (error) toast.error("Failed to update post", { id: toastId });
      else {
        toast.success("Post updated successfully", { id: toastId });
        setIsModalOpen(false);
        fetchPosts();
      }
    } else {
      const { error } = await supabase.from('blog_posts').insert(payload);
      if (error) toast.error("Failed to create post", { id: toastId });
      else {
        toast.success("Post created successfully", { id: toastId });
        setIsModalOpen(false);
        fetchPosts();
      }
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif text-dark font-medium">Blog Manager</h1>
          <p className="text-dark/60 mt-1">Write and publish articles for your visitors</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> New Post
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
                  <th className="px-6 py-4 font-bold">Post Details</th>
                  <th className="px-6 py-4 font-bold">Category</th>
                  <th className="px-6 py-4 font-bold">Date</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark/5">
                {posts.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-dark/40">No blog posts found.</td></tr>
                ) : (
                  posts.map(post => (
                    <tr key={post.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-dark text-base line-clamp-1">{post.title}</p>
                        <p className="text-xs text-dark/50 mt-1 line-clamp-1">{post.excerpt}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-dark bg-gray-100 px-3 py-1 rounded-full">{post.category}</span>
                      </td>
                      <td className="px-6 py-4 text-dark/60 text-xs">
                        {format(new Date(post.created_at), 'MMM dd, yyyy')}
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => togglePublish(post.id, post.is_published)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full uppercase tracking-wider transition-colors ${
                            post.is_published ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}
                        >
                          {post.is_published ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                          {post.is_published ? 'Published' : 'Draft'}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleOpenModal(post)} className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDelete(post.id)} className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors">
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

      {/* Post Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-3xl w-full relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-dark/50 hover:text-dark transition-colors"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-serif text-dark mb-6">{editingPost ? 'Edit Post' : 'Create New Post'}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-dark/70 uppercase tracking-wider mb-2">Title *</label>
                  <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-waabi-bg border border-dark/10 rounded-xl px-4 py-3 text-dark focus:outline-none focus:border-waabi-green-dark" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-dark/70 uppercase tracking-wider mb-2">Slug (URL friendly)</label>
                  <input type="text" placeholder="Auto-generated if empty" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full bg-waabi-bg border border-dark/10 rounded-xl px-4 py-3 text-dark focus:outline-none focus:border-waabi-green-dark" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-dark/70 uppercase tracking-wider mb-2">Category *</label>
                  <input required type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-waabi-bg border border-dark/10 rounded-xl px-4 py-3 text-dark focus:outline-none focus:border-waabi-green-dark" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-dark/70 uppercase tracking-wider mb-2">Cover Image</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full bg-waabi-bg border border-dark/10 rounded-xl px-4 py-2.5 text-dark focus:outline-none focus:border-waabi-green-dark file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-waabi-green/20 file:text-waabi-green-dark" />
                {formData.cover_image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={formData.cover_image} alt="Cover Preview" className="h-32 w-auto rounded-lg mt-3 object-cover shadow-sm border border-dark/10" />
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-dark/70 uppercase tracking-wider mb-2">Excerpt (Short Summary)</label>
                <textarea rows={2} value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} className="w-full bg-waabi-bg border border-dark/10 rounded-xl px-4 py-3 text-dark focus:outline-none focus:border-waabi-green-dark resize-none" />
              </div>

              <div>
                <label className="block text-xs font-bold text-dark/70 uppercase tracking-wider mb-2">Content (Markdown Supported) *</label>
                <textarea required rows={8} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full bg-waabi-bg border border-dark/10 rounded-xl px-4 py-3 text-dark focus:outline-none focus:border-waabi-green-dark resize-y font-mono text-sm" />
              </div>

              <div className="flex items-center gap-3 py-2">
                <input type="checkbox" id="is_published" checked={formData.is_published} onChange={e => setFormData({...formData, is_published: e.target.checked})} className="w-5 h-5 accent-waabi-green-dark" />
                <label htmlFor="is_published" className="font-bold text-dark cursor-pointer">Publish immediately</label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-dark/5">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 font-semibold text-dark/60 hover:text-dark">Cancel</button>
                <button type="submit" className="btn-primary shadow-lg">{editingPost ? 'Update Post' : 'Save Post'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
