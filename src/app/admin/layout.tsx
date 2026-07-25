"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { 
  LayoutDashboard, 
  BedDouble, 
  CalendarCheck, 
  CheckSquare, 
  FileText, 
  Map, 
  Settings, 
  LogOut,
  Menu,
  X,
  Star
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Bookings", href: "/admin/bookings", icon: CalendarCheck },
  { name: "Check-ins", href: "/admin/checkins", icon: CheckSquare },
  { name: "Rooms", href: "/admin/rooms", icon: BedDouble },
  { name: "Blog Posts", href: "/admin/blog", icon: FileText },
  { name: "Experiences", href: "/admin/experiences", icon: Map },
  { name: "Testimonials", href: "/admin/testimonials", icon: Star },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const isLoginPage = pathname === '/admin/login';

  return (
    <div className={`min-h-screen ${isLoginPage ? 'bg-dark' : 'bg-waabi-bg'} flex flex-col md:flex-row`}>
      
      {/* Mobile Header */}
      {!isLoginPage && (
        <div className="md:hidden bg-dark text-white p-4 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-full p-0.5">
              <Image src="/images/logo.png" alt="Logo" width={32} height={32} />
            </div>
            <span className="font-serif font-medium">Extranet</span>
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      )}

      {/* Sidebar */}
      {!isLoginPage && (
        <aside className={`
        fixed md:sticky top-0 left-0 z-40 h-screen bg-dark text-white w-64 flex flex-col transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 hidden md:flex items-center gap-3 border-b border-white/10">
          <div className="w-10 h-10 bg-white rounded-full p-1 shrink-0">
            <Image src="/images/logo.png" alt="Logo" width={40} height={40} />
          </div>
          <div>
            <h2 className="font-serif font-medium leading-tight text-lg">Calcutta Backpackers</h2>
            <span className="text-[10px] text-waabi-green uppercase tracking-wider font-bold">Extranet Portal</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-2 px-4">
          <p className="px-4 text-xs font-bold text-white/40 uppercase tracking-wider mb-2">Menu</p>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin');
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-waabi-green text-dark font-medium' 
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon size={18} className={isActive ? 'text-dark' : 'text-waabi-green'} />
                {item.name}
              </Link>
            )
          })}
        </div>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-400 hover:bg-white/5 rounded-xl transition-colors"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>
      )}

      {/* Main Content */}
      <main className={`flex-1 w-full ${isLoginPage ? '' : 'max-w-[1200px] mx-auto p-4 md:p-8'} overflow-x-hidden`}>
        {children}
      </main>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-dark/80 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
