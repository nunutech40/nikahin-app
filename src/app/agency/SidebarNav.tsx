"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    ChevronRight,
    LayoutDashboard,
    Users,
    FileText,
    BarChart3,
    Settings,
    HelpCircle
} from "lucide-react";

export default function AgencySidebarNav() {
    const pathname = usePathname();

    const menuItems = [
        { label: "Overview", icon: LayoutDashboard, href: "/agency" },
        { label: "My Customers", icon: Users, href: "/agency/customers" },
        { label: "Invitations List", icon: FileText, href: "/agency/invitations" },
        { label: "Performance", icon: BarChart3, href: "/agency/analytics" },
        { label: "Agency Settings", icon: Settings, href: "/agency/settings" },
    ];

    return (
        <nav className="flex-1 px-4 mt-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/agency" && pathname.startsWith(item.href));

                return (
                    <Link
                        key={item.label}
                        href={item.href}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${isActive
                            ? "bg-[#D4AF37] text-slate-900 shadow-lg shadow-amber-500/20 font-bold"
                            : "text-slate-400 hover:bg-slate-800 hover:text-white"
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <item.icon className={`w-5 h-5 transition-colors ${isActive ? "text-slate-900" : "group-hover:text-[#D4AF37]"
                                }`} />
                            <span className="text-sm">{item.label}</span>
                        </div>
                        <ChevronRight className={`w-4 h-4 transition-all ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-hover:translate-x-1"
                            }`} />
                    </Link>
                );
            })}

            <div className="mt-8 pt-6 border-t border-slate-800/50 px-4">
                <div className="flex items-center gap-3 text-slate-500 text-xs font-bold uppercase tracking-widest">
                    <HelpCircle className="w-4 h-4" />
                    Support Center
                </div>
            </div>
        </nav>
    );
}
