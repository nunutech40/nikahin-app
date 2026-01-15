import React from "react";
import { db } from "@/db";
import { users, invitations, guests } from "@/db/schema";
import { count, desc } from "drizzle-orm";
import { Users, FileText, Heart, Activity, TrendingUp, Calendar, ArrowRight, Mail, Globe } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default async function AdminDashboardPage() {
    const usersCount = await db.select({ value: count() }).from(users);
    const invitationsCount = await db.select({ value: count() }).from(invitations);
    const guestsCount = await db.select({ value: count() }).from(guests);

    // Fetch Recent Activity
    const latestUsers = await db.query.users.findMany({
        limit: 5,
        orderBy: [desc(users.createdAt)],
    });

    const latestInvitations = await db.query.invitations.findMany({
        limit: 5,
        with: { user: true },
        orderBy: [desc(invitations.createdAt)],
    });

    const stats = [
        { label: "Total Pengguna", value: String(usersCount[0].value), icon: Users, color: "bg-blue-500" },
        { label: "Undangan Dibuat", value: String(invitationsCount[0].value), icon: FileText, color: "bg-[#D4AF37]" },
        { label: "Total Ucapan/RSVP", value: String(guestsCount[0].value), icon: Heart, color: "bg-rose-500" },
        { label: "Server Status", value: "Online", icon: Activity, color: "bg-emerald-500" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 font-serif tracking-tight">Ringkasan Sistem</h2>
                    <p className="text-slate-500 mt-1">Selamat datang kembali, bos! Berikut adalah performa Nikahin hari ini.</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 group hover:border-amber-200 transition-all">
                        <div className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center text-white mb-4 shadow-lg shadow-gray-200 group-hover:scale-110 transition-transform`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-medium text-slate-400">{stat.label}</p>
                        <p className="text-3xl font-extrabold text-slate-900 mt-1">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Latest Users */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                    <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <Users className="w-5 h-5 text-blue-500" />
                            Pendaftar Terbaru
                        </h3>
                        <Link href="/admin/users" className="text-xs font-bold text-[#D4AF37] hover:underline flex items-center gap-1">
                            Lihat Semua <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                    <div className="divide-y divide-slate-50">
                        {latestUsers.map((u) => (
                            <div key={u.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-xs font-bold uppercase">
                                        {u.email.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800 truncate max-w-[150px]">{u.email}</p>
                                        <p className="text-[10px] text-slate-400 uppercase tracking-wider">{format(new Date(u.createdAt), "d MMM yyyy", { locale: id })}</p>
                                    </div>
                                </div>
                                <div className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase ${u.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                    {u.isActive ? 'Aktif' : 'Baru'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Latest Invitations */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                    <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <Globe className="w-5 h-5 text-[#D4AF37]" />
                            Undangan Terbaru
                        </h3>
                        <Link href="/admin/invitations" className="text-xs font-bold text-[#D4AF37] hover:underline flex items-center gap-1">
                            Lihat Semua <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                    <div className="divide-y divide-slate-50">
                        {latestInvitations.map((inv) => (
                            <div key={inv.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800 truncate max-w-[150px]">/{inv.slug}</p>
                                        <p className="text-[10px] text-slate-400 flex items-center gap-1">
                                            <Mail className="w-3 h-3" /> {inv.user?.email}
                                        </p>
                                    </div>
                                </div>
                                <div className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase ${inv.isPublished ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                    {inv.isPublished ? 'Live' : 'Draft'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
