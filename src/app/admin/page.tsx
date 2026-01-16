import React from "react";
import { db } from "@/db";
import { users, invitations, guests } from "@/db/schema";
import { count, desc, eq } from "drizzle-orm";
import { Users, FileText, Heart, Activity, TrendingUp, Calendar, ArrowRight, Mail, Globe } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import RoyalCard from "@/components/ui/RoyalCard";
import RoyalBadge from "@/components/ui/RoyalBadge";
import SystemDistribution from "@/components/dashboard/SystemDistribution";
import { Lock } from "lucide-react";

export default async function AdminDashboardPage() {
    const usersCount = await db.select({ value: count() }).from(users);
    const invitationsCount = await db.select({ value: count() }).from(invitations);
    const guestsCount = await db.select({ value: count() }).from(guests);

    // Fetch System Distribution
    const publishedCount = await db.select({ value: count() }).from(invitations).where(eq(invitations.isPublished, true));
    const draftCount = await db.select({ value: count() }).from(invitations).where(eq(invitations.isPublished, false));
    const activeUsersCount = await db.select({ value: count() }).from(users).where(eq(users.isActive, true));
    const inactiveUsersCount = await db.select({ value: count() }).from(users).where(eq(users.isActive, false));

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
        { label: "Total Pengguna", value: String(usersCount[0].value), icon: Users, gradient: "from-blue-600 to-indigo-700", shadow: "shadow-blue-200" },
        { label: "Undangan Dibuat", value: String(invitationsCount[0].value), icon: FileText, gradient: "from-[#D4AF37] to-[#B8860B]", shadow: "shadow-amber-200" },
        { label: "Guest Interactions", value: String(guestsCount[0].value), icon: Heart, gradient: "from-rose-500 to-pink-600", shadow: "shadow-rose-200" },
        { label: "Server Status", value: "Online", icon: Activity, gradient: "from-emerald-500 to-teal-600", shadow: "shadow-emerald-200" },
    ];

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 font-serif tracking-tight">Dashboard Overview</h2>
                    <p className="text-slate-400 mt-2 font-medium flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
                        Pantau pertumbuhan ekosistem Nikahin secara real-time.
                    </p>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm self-start">
                    <Calendar className="w-4 h-4 text-[#D4AF37]" />
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">{format(new Date(), "EEEE, d MMMM yyyy", { locale: id })}</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat) => (
                    <RoyalCard key={stat.label} hoverable className="relative overflow-hidden group">
                        {/* Decorative Gradient Background */}
                        <div className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${stat.gradient} opacity-[0.03] rounded-full group-hover:scale-150 transition-transform duration-700`} />

                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-white mb-6 shadow-xl ${stat.shadow} group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                            <stat.icon className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
                            <p className="text-4xl font-black text-slate-900 mt-2 tracking-tighter">{stat.value}</p>
                        </div>
                    </RoyalCard>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* System Distribution Insights */}
                <div className="lg:col-span-1">
                    <SystemDistribution
                        published={Number(publishedCount[0].value)}
                        draft={Number(draftCount[0].value)}
                        activeUsers={Number(activeUsersCount[0].value)}
                        inactiveUsers={Number(inactiveUsersCount[0].value)}
                        totalInvitations={Number(invitationsCount[0].value)}
                    />
                </div>

                <div className="lg:col-span-2 space-y-10">
                    {/* Latest Users */}
                    <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden group/card transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/60">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                            <h3 className="font-serif font-black text-xl text-slate-800 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                    <Users className="w-5 h-5 text-blue-600" />
                                </div>
                                New Citizens
                            </h3>
                            <Link href="/admin/users" className="group/link text-[10px] font-black text-[#D4AF37] hover:text-[#B8860B] uppercase tracking-widest flex items-center gap-2 transition-all">
                                View All <ArrowRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                        <div className="divide-y divide-slate-50 px-2">
                            {latestUsers.map((u) => (
                                <div key={u.id} className="p-5 flex items-center justify-between hover:bg-slate-50/80 rounded-2xl transition-all duration-300 group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-500 text-sm font-black uppercase shadow-sm group-hover:scale-105 transition-transform">
                                            {u.email.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-slate-900 truncate max-w-[150px]">{u.email}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{format(new Date(u.createdAt), "d MMM yyyy", { locale: id })}</p>
                                        </div>
                                    </div>
                                    <RoyalBadge variant={u.isActive ? "success" : "neutral"}>
                                        {u.isActive ? "Active" : "Pending"}
                                    </RoyalBadge>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Latest Invitations */}
                    <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden group/card transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/60">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                            <h3 className="font-serif font-black text-xl text-slate-800 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                                    <Globe className="w-5 h-5 text-amber-600" />
                                </div>
                                Royal Decree
                            </h3>
                            <Link href="/admin/invitations" className="group/link text-[10px] font-black text-[#D4AF37] hover:text-[#B8860B] uppercase tracking-widest flex items-center gap-2 transition-all">
                                View All <ArrowRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                        <div className="divide-y divide-slate-50 px-2">
                            {latestInvitations.map((inv) => (
                                <div key={inv.id} className="p-5 flex items-center justify-between hover:bg-slate-50/80 rounded-2xl transition-all duration-300 group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D4AF37]/10 to-[#D4AF37]/20 flex items-center justify-center text-amber-600 shadow-sm group-hover:scale-105 transition-transform">
                                            <FileText className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-slate-900 truncate max-w-[150px]">/{inv.slug}</p>
                                            <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1.5 mt-0.5">
                                                <Mail className="w-3 h-3 text-slate-300" /> {inv.user?.email}
                                            </p>
                                        </div>
                                    </div>
                                    <RoyalBadge variant={inv.isPublished ? "gold" : "neutral"} icon={inv.isPublished ? Globe : Lock}>
                                        {inv.isPublished ? "Live" : "Draft"}
                                    </RoyalBadge>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
