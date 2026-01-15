import React from "react";
import { db } from "@/db";
import { users, invitations, guests } from "@/db/schema";
import { count, sql } from "drizzle-orm";
import { Users, FileText, Heart, Activity, TrendingUp, Calendar } from "lucide-react";

export default async function AdminDashboardPage() {
    const usersCount = await db.select({ value: count() }).from(users);
    const invitationsCount = await db.select({ value: count() }).from(invitations);
    const guestsCount = await db.select({ value: count() }).from(guests);

    const stats = [
        { label: "Total Pengguna", value: String(usersCount[0].value), icon: Users, color: "bg-blue-500" },
        { label: "Undangan Dibuat", value: String(invitationsCount[0].value), icon: FileText, color: "bg-[#D4AF37]" },
        { label: "Total Ucapan/RSVP", value: String(guestsCount[0].value), icon: Heart, color: "bg-rose-500" },
        { label: "Server Status", value: "Online", icon: Activity, color: "bg-emerald-500" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-bold text-slate-900 font-serif tracking-tight">Ringkasan Sistem</h2>
                <p className="text-slate-500 mt-1">Selamat datang kembali, bos! Berikut adalah performa Nikahin hari ini.</p>
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Activity Card */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 p-8 flex flex-col justify-center items-center text-center">
                    <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 mb-4 animate-pulse">
                        <TrendingUp className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">Siap Untuk Skala Besar?</h3>
                    <p className="text-slate-500 max-w-sm mt-2">Sistem backend kita sudah teroptimasi untuk menangani ribuan undangan secara bersamaan.</p>
                </div>

                {/* Quick Tips */}
                <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform duration-500">
                        <Calendar className="w-32 h-32" />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-lg font-bold text-amber-500 uppercase tracking-widest text-[10px] mb-2">Tips Admin</h3>
                        <p className="text-lg leading-snug font-medium italic">"Jangan lupa cek daftar user baru setiap hari untuk memproses aktivasi manual mereka."</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
