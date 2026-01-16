import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
    LayoutDashboard,
    Users,
    FileText,
    Palette,
    Settings,
    LogOut,
    ShieldCheck,
    ChevronRight
} from "lucide-react";
import SidebarNav from "./SidebarNav";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);
    const adminEmail = session?.user?.email || "Admin";

    return (
        <div className="flex h-screen bg-[#FDFCFB] overflow-hidden relative">
            {/* Background Decorative Element */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-100/20 blur-[120px] rounded-full -mr-64 -mt-64 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-50/30 blur-[100px] rounded-full -ml-32 -mb-32 pointer-events-none" />

            {/* Sidebar */}
            <aside className="w-72 bg-[#0F172A] text-white flex flex-col shrink-0 relative z-20 shadow-2xl">
                <div className="p-8">
                    <Link href="/admin" className="flex items-center gap-4 group">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#F3E5AB] rounded-2xl flex items-center justify-center shadow-xl shadow-amber-900/20 group-hover:scale-105 transition-transform duration-500">
                            <ShieldCheck className="w-7 h-7 text-slate-900" />
                        </div>
                        <div>
                            <h2 className="font-serif font-black text-xl leading-tight uppercase tracking-widest bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Nikahin</h2>
                            <p className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-[0.3em] mt-0.5">Royal Admin</p>
                        </div>
                    </Link>
                </div>

                <SidebarNav />

                <div className="p-6 border-t border-slate-800/50 bg-slate-900/50 backdrop-blur-sm">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all font-semibold text-xs uppercase tracking-wider"
                    >
                        <ChevronRight className="w-4 h-4 rotate-180" />
                        User Dashboard
                    </Link>
                    <Link
                        href="/api/auth/signout"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-rose-400 hover:text-white hover:bg-rose-500/10 transition-all mt-2 font-semibold text-xs uppercase tracking-wider"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden relative z-10">
                {/* Top Header - Glassmorphism */}
                <header className="h-20 bg-white/70 backdrop-blur-md border-b border-slate-200/60 flex items-center justify-between px-10 shrink-0 sticky top-0 z-30">
                    <div>
                        <h1 className="text-2xl font-serif font-bold text-slate-900 tracking-tight">Management Central</h1>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex flex-col items-end">
                            <p className="text-xs font-black text-slate-900 uppercase tracking-widest">{adminEmail.split('@')[0]}</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <p className="text-[9px] text-[#D4AF37] font-black uppercase tracking-widest leading-none">System Authorized</p>
                            </div>
                        </div>
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#D4AF37] to-[#F3E5AB] p-[2px] shadow-lg shadow-amber-200">
                            <div className="w-full h-full bg-[#0F172A] rounded-[14px] flex items-center justify-center text-amber-500">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dynamic Page Content */}
                <div className="flex-1 overflow-y-auto p-10">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
