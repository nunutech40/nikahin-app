import React from "react";
import Link from "next/link";
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

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const menuItems = [
        { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
        { label: "Manajemen User", icon: Users, href: "/admin/users" },
        { label: "Semua Undangan", icon: FileText, href: "/admin/invitations" },
        { label: "Tema & Template", icon: Palette, href: "/admin/themes" },
        { label: "Pengaturan Sistem", icon: Settings, href: "/admin/settings" },
    ];

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0">
                <div className="p-6">
                    <Link href="/admin" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform">
                            <ShieldCheck className="w-6 h-6 text-slate-900" />
                        </div>
                        <div>
                            <h2 className="font-bold text-lg leading-tight uppercase tracking-wider">Nikahin</h2>
                            <p className="text-[10px] text-amber-500 font-bold uppercase tracking-[0.2em]">Super Admin</p>
                        </div>
                    </Link>
                </div>

                <nav className="flex-1 px-4 mt-4 space-y-1 overflow-y-auto">
                    {menuItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.label === "Dashboard" ? "/admin" : item.href}
                            className="flex items-center justify-between px-4 py-3 rounded-xl transition-all hover:bg-slate-800 text-slate-400 hover:text-white group"
                        >
                            <div className="flex items-center gap-3">
                                <item.icon className="w-5 h-5 group-hover:text-amber-500 transition-colors" />
                                <span className="text-sm font-medium">{item.label}</span>
                            </div>
                            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all font-medium text-sm"
                    >
                        <ChevronRight className="w-4 h-4 rotate-180" />
                        Kembali ke Dashboard
                    </Link>
                    <Link
                        href="/api/auth/signout"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-white hover:bg-red-500/10 transition-all mt-1 font-medium text-sm"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Top Header */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
                    <h1 className="text-xl font-bold text-slate-800">Panel Administrator</h1>
                    <div className="flex items-center gap-4">
                        <div className="w-px h-6 bg-slate-200" />
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-xs font-bold text-slate-900 uppercase">Administrator</p>
                                <p className="text-[10px] text-slate-400">System Root</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dynamic Page Content */}
                <div className="flex-1 overflow-y-auto bg-slate-50 p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
