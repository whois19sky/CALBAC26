"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";

export default function AdminLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        // The server has set an httpOnly signed session cookie — nothing to do here.
        router.push("/admin");
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Invalid email or password");
        setLoading(false);
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark flex flex-col justify-center items-center p-6">
      
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center p-1 overflow-hidden shadow-xl mb-4">
            <Image src="/images/logo.png" alt="CB Logo" width={72} height={72} className="object-contain" priority />
          </div>
          <h1 className="text-white font-serif text-3xl font-medium tracking-wide">Calcutta Backpackers</h1>
          <p className="text-waabi-green text-sm uppercase tracking-[0.2em] font-bold mt-2">Extranet Portal</p>
        </div>

        {/* Login Box */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-xl text-white font-medium mb-2">Admin Sign In</h2>
          <p className="text-white/50 text-sm mb-8">Access the property management dashboard.</p>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
              <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2">Email</label>
              <input 
                type="text" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-waabi-green transition-colors"
                placeholder="Admin email"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-waabi-green transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full relative flex items-center justify-center gap-3 bg-waabi-green text-dark py-3.5 px-4 rounded-xl font-bold hover:bg-waabi-green-dark hover:scale-[1.02] transition-all duration-300 shadow-lg disabled:opacity-70 disabled:hover:scale-100"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-dark/20 border-t-dark rounded-full animate-spin"></span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
          
        </div>
      </div>
    </div>
  );
}
