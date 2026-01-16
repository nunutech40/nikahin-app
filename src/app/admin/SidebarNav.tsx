"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    ChevronRight,
    LayoutDashboard,
    Users,
    FileText,
    Palette,
    Settings,
    BarChart3,
    Store,
    CreditCard,
    Package
} from "lucide-react";

export default function SidebarNav() {
    const pathname = usePathname();

    const menuItems = [
        { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
        { label: "Billing & Keuangan", icon: CreditCard, href: "/admin/billing" },
        { label: "Features & Paket", icon: Package, href: "/admin/features" },
        { label: "Manajemen Seller", icon: Store, href: "/admin/sellers" },
        { label: "Manajemen User", icon: Users, href: "/admin/users" },
        { label: "Semua Undangan", icon: FileText, href: "/admin/invitations" },
        { label: "Traffic Insights", icon: BarChart3, href: "/admin/traffic" },
        { label: "Tema & Template", icon: Palette, href: "/admin/themes" },
        { label: "Pengaturan Sistem", icon: Settings, href: "/admin/settings" },
    ];

    return (
        <nav className="flex-1 px-4 mt-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));

                return (
                    <Link
                        key={item.label}
                        href={item.href}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${isActive
                            ? "bg-amber-500 text-slate-900 shadow-lg shadow-amber-500/20 font-bold"
                            : "text-slate-400 hover:bg-slate-800 hover:text-white"
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <item.icon className={`w-5 h-5 transition-colors ${isActive ? "text-slate-900" : "group-hover:text-amber-500"
                                }`} />
                            <span className="text-sm">{item.label}</span>
                        </div>
                        <ChevronRight className={`w-4 h-4 transition-all ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-hover:translate-x-1"
                            }`} />
                    </Link>
                );
            })}
        </nav>
    );
}
